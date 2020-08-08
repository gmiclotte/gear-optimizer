import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Crement } from '../../actions/Crement';
import { EditItem } from '../../actions/EditItem';
import { SetName, Item } from '../../assets/ItemAux';
import { ITEMLIST } from '../../assets/Items';
import { DisableItem, DisableZone } from '../../actions/DisableItem';
import { MassUpdate } from '../../actions/MassUpdateItems';
import { Settings } from '../../actions/Settings';

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

        let B = data.stats.highestBoss
        let eB = data.stats.highestHardBoss
        let sB = data.stats.highestSadisticBoss
        let zone = getZone(B, eB, sB);

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
        let zone;
        if (sB > 248) {
            zone = 44
        } else if (sB > 240) {
            zone = 42
        } else if (sB > 232) {
            zone = 41
        } else if (sB > 224) {
            zone = 40
        } else if (sB > 216) {
            zone = 38
        } else if (sB > 208) {
            zone = 37
        } else if (sB > 175) {
            zone = 36
        } else if (sB > 150) {
            zone = 35
        } else if (sB > 125) {
            zone = 34
        } else if (eB > 200) {
            zone = 33
        } else if (eB > 190) {
            zone = 32
        } else if (eB > 182) {
            zone = 30
        } else if (eB > 174) {
            zone = 29
        } else if (eB > 166) {
            zone = 28
        } else if (eB > 158) {
            zone = 26
        } else if (eB > 125) {
            zone = 25
        } else if (eB > 100) {
            zone = 24
        } else if (eB > 58) {
            zone = 23
        } else if (B > 137) {
            zone = 22
        } else if (B > 132) {
            zone = 21
        } else if (B > 124) {
            zone = 20
        } else if (B > 116) {
            zone = 19
        } else if (B > 108) {
            zone = 17
        } else if (B > 100) {
            zone = 16
        } else if (B > 90) {
            zone = 14
        } else if (B > 82) {
            zone = 13
        } else if (B > 74) {
            zone = 11
        } else if (B > 66) {
            zone = 10
        } else if (B > 58) {
            zone = 8
        } else if (B > 48) {
            zone = 6
        } else if (B > 37) {
            zone = 5
        } else if (B > 17) {
            zone = 4
        } else if (B > 7) {
            zone = 3
        } else {
            zone = 2
        }

        return zone
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
        let inventory = data.inventory.inventory

        let foundIds = []
        const lootys = [67, 128, 169, 230, 296, 389, 431, 505]
        const pendants = [53, 76, 94, 142, 170, 229, 295, 388, 430, 504]

        let hL = 0;
        let hP = 0;

        for (let i of Object.keys(equipped)) {
            let id = equipped[i].id
            let level = equipped[i].level
            if (id !== undefined && id in newData && level !== undefined) {
                newData[id].level = level
                foundIds.push(id)

                if (lootys.includes(id) && id > hL) {
                    hL = id
                }

                if (pendants.includes(id) && id > hP) {
                    hP = id
                }
            }
        }

        for (let i of Object.keys(inventory)) {
            let id = inventory[i].id
            let level = inventory[i].level
            if (id !== undefined && id in newData && level !== undefined) {
                newData[id].level = level
                foundIds.push(id)

                if (lootys.includes(id) && id > hL) {
                    hL = id
                }

                if (pendants.includes(id) && id > hP) {
                    hP = id
                }
            }
        }

        let lIndex = lootys.indexOf(hL)
        let pIndex = pendants.indexOf(hP)
        let accSlots = data.inventory.accs.length

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
        let diff = Math.abs(current - newV)
        if (current < newV) {
            diff = diff
        } else {
            diff = diff * -1
        }

        return diff
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
            <button onClick={() => inputElem.current.click()}>Load Ngusav.es JSON File</button>
            <label>Disable Unowned Items: <input type="checkbox" checked={disableItems} onChange={() => { setDisableItems(!disableItems) }} /></label>
        </div>
    )
}

ImportSaveForm.propTypes = {

}
export default ImportSaveForm;
