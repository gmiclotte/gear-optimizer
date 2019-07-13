export const WISH = 'Optimize wishes.';
export const WISH_ASYNC = 'Optimize wishes async.';
export const WISH_SETTINGS = 'Configure wishes.';

export const WishSettings = (wishstats) => ({
        type: WISH_SETTINGS,
        payload: {
                wishstats: wishstats
        }
});

export const Wish = (vals) => ({
        type: WISH,
        payload: {
                vals: vals
        }
});

export const WishAsync = () => ({type: WISH_ASYNC, payload: {}});
