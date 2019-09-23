export const SETTINGS = 'Configure settings.';

export const Settings = (statname, stats) => ({
        type: SETTINGS,
        payload: {
                statname: statname,
                stats: stats
        }
});
