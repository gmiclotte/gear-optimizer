export const LOCK_ITEM = 'Lock item.';

export const LockItem = (lock, slot, idx) => {
    return {
        type: LOCK_ITEM,
        payload: {
            lock: lock,
            slot: slot,
            idx: idx
        }
    }
};
