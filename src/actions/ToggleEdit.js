export const TOGGLE_EDIT = 'Toggle edit item modal.';

export const ToggleEdit = (itemName, lockable = false, on = true) => ({
        type: TOGGLE_EDIT,
        payload: {
                name: itemName,
                lockable: lockable,
                on: on
        }
});
