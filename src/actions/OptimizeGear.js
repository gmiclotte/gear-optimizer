export const OPTIMIZE_GEAR = 'Optimize gear.';
export const OPTIMIZE_GEAR_ASYNC = 'Optimize gear async.';

export const OptimizeGear = state => ({
    type: OPTIMIZE_GEAR, payload: {
        state
    }
});

export const OptimizeGearAsync = () => ({type: OPTIMIZE_GEAR_ASYNC, payload: {}});
