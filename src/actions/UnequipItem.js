export const UNEQUIP_ITEM = 'Unequip item.';

export const UnequipItem = itemId => ({
    type: UNEQUIP_ITEM,
    payload: {
        id: itemId
    }
});
