export const TOGGLE_EDIT = 'Toggle edit item modal.';

export const ToggleEdit = (itemName, on) => ({
        type: TOGGLE_EDIT,
        payload: {
                name: itemName,
                on: on
        }
});
