export const DROP_EQUIP_ITEM = 'Drop equip item.';

export const DropEquipItem = (source, target) => ({
    type: DROP_EQUIP_ITEM,
    payload: {
        source: source,
        target: target
    }
});
