export const SAVE_SLOT = 'Save.';
export const SAVE_NAME = 'Save name.';
export const SAVE_SELECT = 'Save select.';

export const SaveSlot = () => ({type: SAVE_SLOT});

export const SaveName = (name) => ({
    type: SAVE_NAME,
    payload: {
        name: name
    }
});

export const SaveSelect = (loc, idx) => ({
    type: SAVE_SELECT,
    payload: {
        loc: loc,
        idx: idx
    }
});
