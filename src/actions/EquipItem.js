export const EQUIP_ITEM = 'Equip item.';

export const EquipItem = itemName => ({
        type: EQUIP_ITEM,
        payload: {
                name: itemName
        }
});
