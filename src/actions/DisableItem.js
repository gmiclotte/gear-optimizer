export const DISABLE_ITEM = 'Disable item.';
export const DISABLE_ZONE = 'Disable zone.';

export const DisableItem = itemId => ({
    type: DISABLE_ITEM,
    payload: {
        id: itemId
    }
});

export const DisableZone = zoneId => ({
    type: DISABLE_ZONE,
    payload: {
        id: zoneId
    }
});