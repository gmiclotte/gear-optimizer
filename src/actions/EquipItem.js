export const EQUIP_ITEM = 'Equip item.';
export const EQUIP_ITEMS = 'Equip items.';

export const EquipItem = itemId => {
    return {
        type: EQUIP_ITEM,
        payload: {
            id: itemId
        }
    }
};

export const EquipItems = itemIds => {
    return {
        type: EQUIP_ITEMS,
        payload: {
            ids: itemIds
        }
    }
};
