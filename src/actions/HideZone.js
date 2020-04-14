export const HIDE_ZONE = '(un)Hide zone.';

export const HideZone = (idx) => ({
    type: HIDE_ZONE,
    payload: {
        idx: idx
    }
});
