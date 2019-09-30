export class Augment {
        constructor(augstats, augs) {
                this.augstats = augstats;
                this.augs = augs;
        }

        exponent(idx) {
                let lsc = Number(this.augstats.lsc);
                let difference = 0.1;
                if (lsc > 0) {
                        difference += 0.05;
                }
                if (lsc >= 20) {
                        difference += 0.05;
                        lsc = 20;
                }
                difference += lsc * 0.01;
                return 1 + difference * idx;
        }

        cost(idx, version, isUpgrade, isGold) {
                if (idx > 4 && !isUpgrade && isGold) {
                        return idx === 5
                                ? 1.8e16
                                : 2.3e19;
                }
                const base = isGold
                        ? isUpgrade
                                ? 1e7
                                : 1e4
                        : [2e7, 5e19, 5e34][version];
                const a = isUpgrade
                        ? isGold
                                ? 20
                                : 12
                        : isGold
                                ? 50
                                : 17;
                const b = isUpgrade
                        ? isGold
                                ? 1e3
                                : 8e2
                        : isGold
                                ? 1e3 //never used
                                : 1.4e3;
                return base * Math.pow(a, Math.min(4, idx)) * Math.pow(b, Math.max(0, idx - 4));
        }

        reachable(idx, isUpgrade) {
                const version = Number(this.augstats.version);
                let level = 0
                let ticks = Number(this.augstats.time) * 60 * 50;
                if (ticks > 365 * 4.32e6) {
                        ticks = 365 * 4.32e6;
                }
                const speed = Number(this.augstats.augspeed);
                let ratio = Number(this.augstats.augs[idx].ratio);
                ratio = isUpgrade
                        ? 1 / (ratio + 1)
                        : ratio / (ratio + 1);
                const cap = Number(this.augstats.ecap) * ratio;
                const base = this.cost(idx, version, isUpgrade, false);
                const basegold = this.cost(idx, version, isUpgrade, true);
                const gpt = Number(this.augstats.gps) / 50;
                let gold = Number(this.augstats.gold) + gpt; //add 1 tick worth of gold
                const bbtill = cap * speed / base;
                const totalgold = gold + gpt * ticks;
                if (totalgold > Math.pow(ticks, 2) * basegold && 500 * bbtill > level) {
                        // handle bar fills up to 0.1s
                        for (let i = 1; i < 501; i++) {
                                if (i * bbtill >= level + Math.floor(ticks / i)) {
                                        return [
                                                Math.min(1e9, level + Math.floor(ticks / i)),
                                                false
                                        ];
                                } else if (Math.floor(i * bbtill) > level) {
                                        ticks -= i * (Math.floor(i * bbtill) - level);
                                        level = Math.floor(i * bbtill);
                                }
                        }
                }
                //handle slow bar fills
                let goldlimited = false;
                while (ticks > 0 && level < 1e9) {
                        const cost = basegold * (level + 1);
                        if (gold < cost) {
                                goldlimited = true;
                                if (gpt <= 0) {
                                        break;
                                }
                                const reqticks = Math.ceil((cost - gold) / gpt);
                                ticks -= reqticks;
                                if (ticks < 0) {
                                        ticks = 0;
                                }
                                gold += reqticks * gpt;
                        } else {
                                const reqticks = Math.ceil(base * (level + 1) / (cap * speed));
                                ticks -= reqticks;
                                gold += reqticks * gpt - cost;
                                level++;
                        }
                }
                //correct overfill
                if (ticks < 0) {
                        level--;
                }
                return [
                        Math.min(1e9, level),
                        goldlimited
                ];
        }

        boost(idx, auglevel, upglevel) {
                const factor = [1, 1, 1e12][Number(this.augstats.version)];
                const augbonus = this.augs[idx].boost * Math.pow(auglevel, this.exponent(idx));
                const upgbonus = Math.pow(1 + upglevel, 2);
                return Math.max(1, Math.floor(augbonus * upgbonus / factor));
        }
}
