export const DISABLE_ITEM = 'Disable item.';

export const DisableItem = itemId => ({
        type: DISABLE_ITEM,
        payload: {
                id: itemId
        }
});
