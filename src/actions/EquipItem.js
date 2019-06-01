export const EQUIP_ITEM = 'Equip item.';

export const EquipItem = itemName => {
        return {
                type: EQUIP_ITEM,
                payload: {
                        name: itemName
                }
        }
};
