export const WISH = 'Optimize wishes.';
export const WISH_ASYNC = 'Optimize wishes async.';

export const Wish = (vals) => ({
    type: WISH,
    payload: {
        vals: vals
    }
});

export const WishAsync = () => ({type: WISH_ASYNC, payload: {}});
