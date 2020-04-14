export const OPTIMIZE_SAVES = 'Optimize saves.';
export const OPTIMIZE_SAVES_ASYNC = 'Optimize saves async.';

export const OptimizeSaves = state => ({
    type: OPTIMIZE_SAVES, payload: {
        state
    }
});

export const OptimizeSavesAsync = () => ({type: OPTIMIZE_SAVES_ASYNC, payload: {}});
