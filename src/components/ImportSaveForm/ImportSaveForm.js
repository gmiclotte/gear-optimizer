import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Crement } from '../../actions/Crement';
import { MassUpdate } from '../../actions/MassUpdateItems';
import { Settings } from '../../actions/Settings';

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

const ImportSaveForm = () => {
    const dispatch = useDispatch();
    const optimizerState = useSelector(state => state.optimizer);
    const [disableItems, setDisableItems] = useState(false);
    let fileReader;

    const inputElem = useRef(null);

    const handleFileRead = (e) => {
        const content = fileReader.result
        let data = JSON.parse(content)

        console.log(data)

        let newItemData = { ...optimizerState.itemdata }

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

        updateAugmentTab(data)
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
        if (optimizerState.zone >= 34) {
            nac = augdata.noAugsChallenge.curSadisticCompletions
            lsc = augdata.laserSwordChallenge.curSadisticCompletions
        } else if (optimizerState.zone >= 23) {
            nac = augdata.noAugsChallenge.curEvilCompletions
            lsc = augdata.laserSwordChallenge.curEvilCompletions
        } else {
            nac = augdata.noAugsChallenge.curCompletions
            lsc = augdata.laserSwordChallenge.curCompletions
        }
        dispatch(Settings("augstats", { ...optimizerState.augstats, lsc: lsc, nac: nac, ecap: energyCap }))
    }


    const updateItemLevels = (data, newData) => {
        let equipped = data.inventory

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
        fileReader.onloadend = handleFileRead;
        try {
            fileReader.readAsText(file)
        } catch{
            inputElem.current.value = null
        }

    }

    return (
        <div className="loadSave">
            <input ref={inputElem} style={{ display: "none" }} type='file' id='savefileloader' accept='.json' onChange={e => handleFilePick(e)} />
            <button onClick={() => inputElem.current.click()}>Load NGUSav.es JSON</button>
            <label>Disable unowned<input type="checkbox" checked={disableItems} onChange={() => { setDisableItems(!disableItems) }} /></label>
        </div>
    )
}

ImportSaveForm.propTypes = {

}
export default ImportSaveForm;
