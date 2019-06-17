export class Augment {
        constructor(lsc, time) {
                this.lsc = lsc;
                this.time = time;
                this.T = time * 60 * 50;
                this.BA = [
                        400, 400 * 17,
                        400 * 17 ** 2,
                        400 * 17 ** 3,
                        400 * 17 ** 4,
                        (400 * 17 ** 4) * 1400,
                        (400 * 17 ** 4) * (1400 ** 2)
                ];
                this.BU = [
                        400, 400 * 12,
                        400 * 12 ** 2,
                        400 * 12 ** 3,
                        400 * 12 ** 4,
                        (400 * 12 ** 4) * 800,
                        (400 * 12 ** 4) * (800 ** 2)
                ];
                this.eu = 2;
                this.difference = 0.1;
                if (this.lsc > 0) {
                        this.difference += 0.05;
                }
                if (this.lsc >= 20) {
                        this.difference += 0.05;
                }
                this.difference += this.lsc * 0.01;
        }

        ea(idx) {
                return 1 + idx * this.difference;
        }

        tbb(a, b) {
                const x = Math.floor(a / b);
                const y = a - x * b;
                return (a + y) * (x + 1) / 2;
        }

        tm(a, m) {
                return m * a * (a + 1) / 2;
        }

        bm(a) {
                if (a === 0) {
                        return [1, 1];
                }
                let b = 1;
                let m = 1;
                let inf = 1;
                let sup = 1;
                let last = -1;
                let t = a * (a + 1) / 2;
                if (this.T > t) {
                        while (this.T > t) {
                                sup *= 10;
                                t = this.tm(a, sup);
                        }
                        inf = sup / 10;
                        while (true) {
                                m = (sup + inf) / 2;
                                if (Math.abs(m - last) < 0.0001) {
                                        break;
                                }
                                t = this.tm(a, m);
                                if (this.T > t) {
                                        inf = m;
                                } else {
                                        sup = m;
                                }
                                last = m;
                        }
                } else if (this.T < t) {
                        while (this.T < t && a > 10 * sup) {
                                sup *= 10;
                                t = this.tbb(a, sup);
                        }
                        inf = sup / 10;
                        while (true) {
                                b = Math.floor((sup + inf) / 2);
                                if (b === last) {
                                        if (this.T < t) {
                                                b += 1;
                                        }
                                        break;
                                }
                                t = this.tbb(a, b);
                                if (this.T < t) {
                                        inf = b;
                                } else {
                                        sup = b;
                                }
                                last = b;
                        }
                }
                return [b, m];
        }

        get_cost_ba(idx, a) {
                const ba = this.BA[idx]
                const tmp = this.bm(a)
                const b = tmp[0];
                const m = tmp[1];
                return b === 1
                        ? this.T * ba / m
                        : this.T * ba * b;
        }

        get_cost_bu(idx, u) {
                const bu = this.BU[idx];
                const tmp = this.bm(u)
                const b = tmp[0];
                const m = tmp[1];
                return b === 1
                        ? this.T * bu / m
                        : this.T * bu * b;
        }

        get_cost_bb(idx, a) {
                const y = this.eu / this.ea(idx);
                const ca = this.get_cost_ba(idx, a);
                const cu = ca * y;
                return ca + cu;
        }

        get_level(idx, c, upgrade = false) {
                const ba = upgrade
                        ? this.BU[idx]
                        : this.BA[idx];
                const y = this.eu / this.ea(idx);
                let ca = c / (1 + y);
                ca *= upgrade
                        ? y
                        : 1;
                const b = Math.floor(ca / this.T / ba);
                if (b <= 1) {
                        const Da = 1 + 8 * ca / ba;
                        return (Da ** 0.5 - 1) / 2;
                }
                let d = b ** 2 + 8 * b * this.T;
                let a = Math.floor((-b + d ** 0.5) / 2 / b) * b;
                let mult = 1;
                let adds = [];
                while (mult * 2 < b) {
                        mult *= 2;
                        adds.push(Math.floor(b / mult));
                }
                adds.push(1);
                const limit = a + b;
                for (let i in adds) {
                        const add = adds[i];
                        if (upgrade) {
                                while (this.get_cost_bu(idx, a + add) < ca) {
                                        a += add;
                                }
                        } else {
                                while (this.get_cost_ba(idx, a + add) < ca) {
                                        a += add;
                                }
                        }
                }
                return a;
        }

        get_ratio(idx, c) {
                const ka = 25 ** idx
                const ku = 1
                const y = this.eu / this.ea(idx)
                let a = Math.floor(this.get_level(idx, c, false))
                const ca = this.get_cost_ba(idx, a)
                let u = Math.floor(this.get_level(idx, c, true))
                const cu = this.get_cost_bu(idx, u)
                const c_ = ca + cu
                if (a > this.T) {
                        a = this.T
                }
                if (u > this.T) {
                        u = this.T;
                }
                const fa = Math.floor(a) ** this.ea(idx) * ka;
                const fu = Math.floor(1 + u) ** this.eu * ku;
                const f = fa * fu;
                return [a, u, f];
        }

        optimize() {
                let vals = [];
                for (let idx = 1; idx < 7; idx++) {
                        let a = 1;
                        while (true) {
                                const c = this.get_cost_bb(idx, a);
                                const flow = this.get_ratio(idx - 1, c)[2];
                                const fhigh = this.get_ratio(idx, c)[2];
                                if (fhigh > flow) {
                                        break;
                                }
                                a *= 10;
                        }
                        let sup = a;
                        while (true) {
                                const c = this.get_cost_bb(idx, a);
                                const flow = this.get_ratio(idx - 1, c)[2]
                                const fhigh = this.get_ratio(idx, c)[2]
                                if (fhigh < flow) {
                                        break;
                                }
                                a /= 2;
                        }
                        let inf = a;
                        let last = -1;
                        while (inf != sup) {
                                a = Math.floor((sup + inf) / 2);
                                if (a === last) {
                                        break;
                                }
                                const c = this.get_cost_bb(idx, a);
                                const flow = this.get_ratio(idx - 1, c)[2];
                                const fhigh = this.get_ratio(idx, c)[2];
                                if (fhigh < flow) {
                                        inf = a
                                } else {
                                        sup = a
                                }
                                last = a;
                        }
                        const c = this.get_cost_bb(idx, a);
                        let tmp = this.get_ratio(idx - 1, c);
                        let alow = tmp[0];
                        let ulow = tmp[1];
                        let flow = tmp[2];
                        tmp = this.get_ratio(idx, c);
                        let ahigh = tmp[0];
                        let uhigh = tmp[1];
                        let fhigh = tmp[2];
                        vals.push([
                                alow,
                                ulow,
                                flow,
                                ahigh,
                                uhigh,
                                fhigh
                        ]);
                }
                return vals;
        }
}
