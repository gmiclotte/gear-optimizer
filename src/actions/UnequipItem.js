export const UNEQUIP_ITEM = 'Unequip item.';

export const UnequipItem = itemName => ({
        type: UNEQUIP_ITEM,
        payload: {
                name: itemName
        }
});
