export const EDIT_ITEM = 'Edit item.';

export const EditItem = val => {
        return {
                type: EDIT_ITEM,
                payload: {
                        val: val===undefined
                                ? 0
                                : Number(val)
                }
        }
};
