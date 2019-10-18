export const SAVE_SLOT = 'Save.';
export const SAVE_NAME = 'Save name.';

export const SaveSlot = () => ({type: SAVE_SLOT});

export const SaveName = (name) => ({
        type: SAVE_NAME,
        payload: {
                name: name
        }
});
