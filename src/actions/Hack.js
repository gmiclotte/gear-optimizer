export const HACK = 'Optimize hacks.';
export const HACK_ASYNC = 'Optimize hacks async.';
export const HACK_SETTINGS = 'Configure hacks.';

export const HackSettings = (hackstats) => ({
        type: HACK_SETTINGS,
        payload: {
                hackstats: hackstats
        }
});

export const Hack = (vals) => ({
        type: HACK,
        payload: {
                vals: vals
        }
});

export const HackAsync = () => ({type: HACK_ASYNC, payload: {}});
