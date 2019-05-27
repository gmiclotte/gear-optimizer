export const DISABLE_ITEM = 'Disable item.';

export const DisableItem = itemName => ({
        type: DISABLE_ITEM,
        payload: {
                name: itemName
        }
});
