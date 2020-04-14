import {Factors, Hacks} from './assets/ItemAux';
import {speedmodifier} from './util';

export class Hack {
    constructor(state) {
        this.hackstats = state.hackstats;
        this.state = state;
    }

    speed() {
        let speed = this.hackstats.hackspeed;
        speed *= speedmodifier(this.hackstats, this.state, Factors.HACK, {
            rBetaPot: 2,
            rDeltaPot: 3
        });
        return speed;
    }

    bonus(level, idx) {
        const hack = Hacks[idx];
        return (level * hack[2] + 100) * hack[3] ** this.milestones(level, idx);
    }

    milestones(level, idx) {
        const hack = Hacks[idx];
        const reducer = this.hackstats.hacks[idx].reducer;
        return Math.floor(level / (hack[4] - reducer));
    }

    milestoneLevel(level, idx) {
        const hack = Hacks[idx];
        const reducer = this.hackstats.hacks[idx].reducer;
        return Math.floor(level / (hack[4] - reducer)) * (hack[4] - reducer);
    }

    reachable(level, mins, idx) {
        const cap = this.hackstats.rcap;
        const pow = this.hackstats.rpow;
        let speed = this.speed();
        let ticks = mins * 60 * 50;
        const base = Hacks[idx][1];
        let sf = 1;
        if (idx === 13) {
            sf = this.bonus(level, idx)
        }
        speed /= sf;
        while (ticks > 0) {
            ticks -= Math.ceil(base * (level + 1) * 1.0078 ** level / (cap * pow * speed * sf));
            level++;
            if (idx === 13) {
                // update speed factor
                sf = this.bonus(level, idx)
            }
        }
        if (ticks < 0) {
            level--;
        }
        return level;
    }

    time(level, target, idx) {
        const cap = this.hackstats.rcap;
        const pow = this.hackstats.rpow;
        let speed = this.speed();
        let ticks = 0;
        const base = Hacks[idx][1];
        let sf = 1;
        if (idx === 13) {
            sf = this.bonus(level, idx)
        }
        speed /= sf;
        while (level < target) {
            ticks += Math.ceil(base * (level + 1) * 1.0078 ** level / (cap * pow * speed * sf));
            level++;
            if (idx === 13) {
                // update speed factor
                sf = this.bonus(level, idx)
            }
        }
        return ticks;
    }
}
