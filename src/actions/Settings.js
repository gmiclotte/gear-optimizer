export const SETTINGS = 'Configure settings.';
export const TITAN = 'Go to titan.';

export const Settings = (statname, stats) => ({
    type: SETTINGS,
    payload: {
        statname: statname,
        stats: stats
    }
});

export const Go2Titan = (titan, looty, pendant, accslots) => ({
    type: TITAN,
    payload: {
        titan: titan,
        looty: looty,
        pendant: pendant,
        accslots: accslots
    }
});
