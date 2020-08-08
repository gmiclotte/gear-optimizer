export const MASSUPDATE = 'Mass Update Items.';

export const MassUpdate = (itemdata) => ({
    type: MASSUPDATE,
    payload: {
        data: itemdata
    }
});
