export const EQUIP_ITEM = 'Equip item.';
export const EQUIP_ITEMS = 'Equip items.';

export const EquipItem = itemName => {
        return {
                type: EQUIP_ITEM,
                payload: {
                        name: itemName
                }
        }
};

export const EquipItems = itemNames => {
        return {
                type: EQUIP_ITEMS,
                payload: {
                        names: itemNames
                }
        }
};
