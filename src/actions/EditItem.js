export const EDIT_ITEM = 'Edit item.';

export const EditItem = (itemId, level) => {
    return {
        type: EDIT_ITEM,
        payload: {
            itemId: itemId,
            level: level === undefined
                ? 0
                : Number(level)
        }
    }
};
