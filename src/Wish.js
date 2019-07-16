import {Wishes} from './assets/ItemAux'

export class Wish {
        constructor(wishstats) {
                this.wishstats = wishstats;
        }

        min_cap() {
                if (this.wishstats.wishidx >= Wishes.length) {
                        return ['Wish ' + this.wishstats.wishidx + ' doesn\'t exist yet.'];
                }
                const cost = Wishes[this.wishstats.wishidx][1] * this.wishstats.goal;
                if (cost === 0) {
                        return ['Base cost for wish ' + this.wishstats.wishidx + ' is not known yet.'];
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
                const maxcapproduct = this.wishstats.ecap * this.wishstats.mcap * this.wishstats.rcap;
                const minticks = factor < this.wishstats.rcap
                        ? wishcap
                        : capreq * wishcap / maxcapproduct ** .17;
                let minmins = Math.ceil(minticks / 50 / 60);
                let result = [
                        vals[0] + ' E; ' + vals[1] + ' M; ' + vals[2] + ' R3',
                        ''
                ];
                if (factor >= this.wishstats.rcap) {
                        let days = Math.floor(minmins / 60 / 24);
                        minmins -= days * 24 * 60;
                        let hours = Math.floor(minmins / 60);
                        minmins -= hours * 60;
                        if (days > 0) {
                                result[1] += days + 'd ';
                        }
                        if (days > 0 || hours > 0) {
                                result[1] += hours + 'h ';
                        }
                        result[1] += minmins + 'm.';
                }
                return result;
        }

        optimize() {
                let vals = [];
                return vals;
        }
}
