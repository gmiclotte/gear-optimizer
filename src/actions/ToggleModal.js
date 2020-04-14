export const TOGGLE_MODAL = 'Toggle modal.';

export const ToggleModal = (name, data) => ({
    type: TOGGLE_MODAL,
    payload: {
        name: name,
        data: data
    }
});
