import {Hacks} from './assets/ItemAux';

const shortenExponential = (val) => {
        if (val < 10000) {
                return val;
        }
        return (val - 10 ** Math.floor(Math.log10(val) - 3)).toExponential(3);
}

export class Hack {
        constructor(hackstats) {
                this.hackstats = hackstats;
        }

        optimize() {
                console.log('Optimizing hacks...')
                return [];
        }
}
