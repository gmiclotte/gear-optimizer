import {WISHCOST} from './assets/ItemAux'

export class Wish {
        constructor(wishstats) {
                this.wishstats = wishstats;
        }

        min_cap() {
                if (this.wishstats.wishidx >= WISHCOST.length) {
                        return 'Unknown value!';
                }
                const cost = WISHCOST[this.wishstats.wishidx] * this.wishstats.goal;
                if (cost === 0) {
                        return 'Unknown value!';
                }
                const wishcap = this.wishstats.wishcap/* minutes */ * 60 * 50;
                const powproduct = (this.wishstats.epow * this.wishstats.mpow * this.wishstats.rpow) ** .17;
                const capreq = cost / wishcap / this.wishstats.wishspeed / powproduct;
                const ratio = [
                        this.wishstats.ecap / this.wishstats.rcap,
                        this.wishstats.mcap / this.wishstats.rcap,
                        1
                ];
                const capproduct = ratio.reduce((x, res) => x * res, 1);
                const factor = (capreq / capproduct ** .17) ** (1 / .17 / 3);
                const vals = ratio.map(x => {
                        let val = (x * factor);
                        if (val > 1000) {
                                val = val.toExponential(2);
                        } else {
                                val = Math.ceil(val);
                        }
                        return val >= 1
                                ? val
                                : 1;
                });
                return vals[0] + ' E; ' + vals[1] + ' M; ' + vals[2] + ' R3';
        }

        optimize() {
                let vals = [];
                return vals;
        }
}
