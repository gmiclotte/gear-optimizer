import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Crement} from '../../actions/Crement';
import {MassUpdate} from '../../actions/MassUpdateItems';
import {Settings} from '../../actions/Settings';
import {Deserializer} from './deserializeDotNet'

// minimal boss for each zone, per difficulty
const sadisticZones = [
    // TODO: add new zones here
    [248, 44],
    [240, 42],
    [232, 41],
    [224, 40],
    [216, 38],
    [208, 37],
    [175, 36],
    [150, 35],
    [125, 34],
];

const evilZones = [
    [200, 33],
    [190, 32],
    [182, 30],
    [174, 29],
    [166, 28],
    [158, 26],
    [125, 25],
    [100, 24],
    [58, 23],
];

const normalZones = [
    [138, 22],
    [132, 21],
    [124, 20],
    [116, 19],
    [108, 17],
    [100, 16],
    [90, 14],
    [82, 13],
    [74, 11],
    [66, 10],
    [58, 8],
    [48, 6],
    [37, 5],
    [17, 4],
    [7, 3],
];

const ImportSaveForm = (props) => {
    const dispatch = useDispatch();
    const optimizerState = useSelector(state => state.optimizer);
    const [disableItems, setDisableItems] = useState(false);
    let fileReader;

    const inputElem = useRef(null);

    const handleFileRead = (rawSave) => (e) => {
        let data
        if (rawSave) {
            const rawData = Deserializer.fromFile(fileReader.result)[1];
            data = Deserializer.convertData(undefined, rawData);
        } else {
            const content = fileReader.result
            data = JSON.parse(content)
        }

        console.log("Imported data", data);

        let newItemData = {...optimizerState.itemdata};

        let zone = getZone(
            data.highestBoss,
            data.highestHardBoss,
            data.highestSadisticBoss,
        );

        dispatch(Crement("zone", calculateDiff(optimizerState.zone, zone), 2, 44))
        resetItems(newItemData)
        let found = updateItemLevels(data, newItemData)
        if (disableItems) {
            disableUnownedItems(found, newItemData)
        }

        dispatch(MassUpdate(newItemData))

        updateNgus(data)

        updateAugmentTab(data)

        updateHackTab(data)
    }

    const getZone = (B, eB, sB) => {
        let zones = [sadisticZones, evilZones, normalZones];
        let bosses = [sB, eB, B];
        for (let i = 0; i < 3; i++) {
            if (bosses[i] <= 1) {
                // not in this difficulty yet
                continue;
            }
            for (let j = 0; j < zones[i].length; j++) {
                if (bosses[i] > zones[i][j][0]) {
                    return zones[i][j][1];
                }
            }
        }
        return 2;
    }

    const updateAugmentTab = (data) => {
        let energyCap = Math.max(data.capEnergy, data.curEnergy)
        let nac;
        let lsc;
        let augdata = data.challenges
        nac = augdata.noAugsChallenge.curCompletions
        lsc = augdata.laserSwordChallenge.curCompletions
        dispatch(Settings("augstats", {...optimizerState.augstats, lsc: lsc, nac: nac, ecap: energyCap}))
    }

    const updateHackTab = (data) => {
        let hacks = data.hacks.hacks;

        let newState = {...optimizerState.hackstats}
        for (let i = 0; i < newState.hacks.length; i++) {
            newState.hacks[i].level = hacks[i].level
        }
        dispatch(Settings("hackstats", newState));
    }


    const updateItemLevels = (data, newData) => {
        let equipped = data.inventory

        // fix [null, null] entries that make the accs array always have length 20
        equipped.accs = equipped.accs.filter(x => !isNaN(x.id));

        let foundIds = []
        const lootys = [67, 128, 169, 230, 296, 389, 431, 505]
        const pendants = [53, 76, 94, 142, 170, 229, 295, 388, 430, 504]

        let hL = 0;
        let hP = 0;

        let found = {};

        const updateItem = (item, _) => {
            let id = item.id;
            let level = item.level;
            if (id !== undefined && id in newData && level !== undefined) {
                if (found[id] !== undefined) {
                    // multiple copies !
                    if (level < newData[id].level) {
                        return;
                    }
                }
                found[id] = true;
                newData[id].level = level;
                foundIds.push(id);
                if (lootys.includes(id) && id > hL) {
                    // set highest looty
                    hL = id;
                }
                if (pendants.includes(id) && id > hP) {
                    // set highest pendant
                    hP = id;
                }
            }
        };
        // gather equipment, accs, and inventory items
        for (let i of Object.keys(equipped)) {
            updateItem(equipped[i], i);
        }
        for (let i = 0; i < equipped.accs.length; i++) {
            updateItem(equipped.accs[i], i);
        }
        for (let i of Object.keys(equipped.inventory)) {
            updateItem(equipped.inventory[i], i)
        }

        let lIndex = lootys.indexOf(hL)
        let pIndex = pendants.indexOf(hP)
        let accSlots = equipped.accs.length

        let accDiff = calculateDiff(optimizerState.equip.accessory.length, accSlots)

        if (accDiff < 0) {
            for (let i = 0; i > accDiff; i--) {
                dispatch(Crement("accslots", -1, 0, 100))
            }
        } else if (accDiff > 0) {
            for (let i = 0; i < accDiff; i++) {
                dispatch(Crement("accslots", 1, 0, 100))
            }
        }

        dispatch(Crement("looty", calculateDiff(optimizerState.looty, lIndex)))
        dispatch(Crement("pendant", calculateDiff(optimizerState.pendant, pIndex)))


        return foundIds
    }

    const calculateDiff = (current, newV) => {
        return newV - current;
    }

    const updateNgus = (data) => {
        let ngus = []
        for (let i = 0; i < data.NGU.skills.length; i++) {
            const skill = data.NGU.skills[i];
            let temp = {}
            temp.normal = skill.level
            temp.evil = skill.evilLevel
            temp.sadistic = skill.sadisticLevel
            ngus.push(temp)
        }

        let mngus = []
        for (let i = 0; i < data.NGU.magicSkills.length; i++) {
            const magicSkill = data.NGU.magicSkills[i];
            let temp = {}
            temp.normal = magicSkill.level
            temp.evil = magicSkill.evilLevel
            temp.sadistic = magicSkill.sadisticLevel
            mngus.push(temp)
        }

        let newState = {...optimizerState.ngustats}

        newState.quirk.e2n = data.beastQuest.quirkLevel[14] > 0
        newState.quirk.s2e = data.beastQuest.quirkLevel[89] > 0
        newState.blueHeart = data.inventory.itemList.itemMaxxed[195]
        newState.eBetaPot = data.arbitrary.energyPotion2InUse
        newState.eDeltaPot = data.arbitrary.energyPotion1Time.totalseconds > 0
        newState.energy.cap = Math.max(data.capEnergy, data.curEnergy)
        newState.energy.ngus = ngus
        newState.mBetaPot = data.arbitrary.magicPotion2InUse
        newState.mDeltaPot = data.arbitrary.magicPotion1Time.totalseconds > 0
        newState.magic.cap = Math.max(data.magic.capMagic, data.magic.curMagic)
        newState.magic.ngus = mngus

        dispatch(Settings("ngustats",
            newState
        ))
    }

    const disableUnownedItems = (foundIds, newData) => {
        for (let i of Object.keys(newData)) {
            if (!foundIds.includes(newData[i].id)) {
                newData[i].disable = true
            }
        }
    }

    const resetItems = (newdata) => {
        for (let i of Object.keys(newdata)) {
            newdata[i].disable = false
            newdata[i].level = 100
        }
    }


    const handleFilePick = (e) => {
        let file = e.target.files[0]
        e.target.value = null
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead(file.type !== 'application/json');
        try {
            fileReader.readAsText(file)
        } catch {
            inputElem.current.value = null
        }

    }

    return (
        <div className="loadSave">
            <input ref={inputElem} style={{display: "none"}} type='file' id='savefileloader'
                   onChange={e => handleFilePick(e)}/>
            <button onClick={() => inputElem.current.click()}
                    data-tip={"Supported file types are<br/>(1) raw NGU save files, and<br/>(2) NGUSav.es JSON files."}
                    data-place="bottom"
            >Import save from file
            </button>
            <label>Disable unowned<input type="checkbox" checked={disableItems} onChange={() => {
                setDisableItems(!disableItems)
            }}/></label>
        </div>
    )
}

ImportSaveForm.propTypes = {}
export default ImportSaveForm;
