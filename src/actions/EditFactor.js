export const EDIT_FACTOR = 'Edit factor.';

export const EditFactor = (idx, name) => ({
    type: EDIT_FACTOR,
    payload: {
        name: name,
        idx: idx
    }
});
