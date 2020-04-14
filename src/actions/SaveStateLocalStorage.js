export const SAVE_STATE_LOCALSTORAGE = 'Saving state to Local Storage';

export const SaveStateLocalStorage = state => ({
    type: SAVE_STATE_LOCALSTORAGE, payload: {
        state
    }
});
