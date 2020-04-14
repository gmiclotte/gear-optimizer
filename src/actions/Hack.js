export const HACK = 'Optimize hacks.';
export const HACK_ASYNC = 'Optimize hacks async.';

export const Hack = (vals) => ({
    type: HACK,
    payload: {
        vals: vals
    }
});

export const HackAsync = () => ({type: HACK_ASYNC, payload: {}});
