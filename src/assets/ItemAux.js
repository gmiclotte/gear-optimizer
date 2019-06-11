export class Item {
        constructor(name, slot, zone, level, props) {
                this.name = name;
                this.slot = slot;
                this.zone = zone;
                this.level = level;
                this.statnames = []
                this.base = {}
                this.disable = false;
                for (let i = 0; i < props.length; i++) {
                        this.statnames.push(props[i][0]);
                        this[props[i][0]] = props[i][1];
                        this.base[props[i][0]] = props[i][1] / 2;
                }
        }
}

export function update_level(item, level) {
        for (let stat in item.base) {
                item[stat] = item.base[stat] * (1 + level / 100);
        }
        item.level = level;
}

export class EmptySlot extends Item {
        constructor(slot) {
                if (slot === undefined) {
                        super('Empty Slot', slot, undefined, undefined, []);
                } else {
                        super('Empty ' + slot[0][0].toUpperCase() + slot[0].substring(1) + ' Slot', slot, undefined, undefined, []);
                }
                this.empty = true;
        }
}

export class Equip extends Item {
        constructor() {
                super('total', undefined, undefined, 100, []);
                this.items = [];
                this.counts = {};
                Object.getOwnPropertyNames(Slot).map((x) => {
                        this.counts[Slot[x][0]] = 0;
                        return undefined;
                });
                Object.getOwnPropertyNames(Stat).map((x) => {
                        this[Stat[x]] = 100;
                        this.statnames.push(Stat[x]);
                        return undefined;
                });
                // correct POWER, TOUGHNESS and RESPAWN since these are additive from 0 instead of 100%
                this[Stat.POWER] = 0;
                this[Stat.TOUGHNESS] = 0;
                this[Stat.RESPAWN] = 0;
        }
}

export class ItemContainer {
        constructor(items) {
                this.names = [];
                for (let i = 0; i < items.length; i++) {
                        this.names.push(items[i][0]);
                        this[items[i][0]] = items[i][1];
                }
        }
}

export const ItemNameContainer = (accslots) => {
        let container = {};
        const slotlist = Object.getOwnPropertyNames(Slot);
        for (let idx in slotlist) {
                const slot = slotlist[idx];
                const slotname = Slot[slot][0];
                let list = [];
                if (slot === 'ACCESSORY') {
                        for (let jdx = 0; jdx < accslots; jdx++) {
                                list.push(new EmptySlot(Slot[slot]).name);
                        }
                } else {
                        list.push(new EmptySlot(Slot[slot]).name);
                }
                container[slotname] = list;
        };
        return container;
};

export const Slot = {
        WEAPON: [
                'weapon', 0
        ],
        HEAD: [
                'head', 1
        ],
        CHEST: [
                'armor', 2
        ],
        PANTS: [
                'pants', 3
        ],
        BOOTS: [
                'boots', 4
        ],
        ACCESSORY: ['accessory', 5]
}

export const Stat = {
        ADVANCE_TRAINING: 'Advanced Training Speed',
        AP: 'AP',
        AUGMENT_SPEED: 'Augment Speed',
        BEARD_SPEED: 'Beard Speed',
        COOKING: 'Cooking',
        DAYCARE_SPEED: 'Daycare Speed',
        DROP_CHANCE: 'Drop Chance',
        ENERGY_BARS: 'Energy Bars',
        ENERGY_CAP: 'Energy Cap',
        ENERGY_POWER: 'Energy Power',
        ENERGY_SPEED: 'Energy Speed',
        EXPERIENCE: 'Experience',
        GOLD_DROP: 'Gold Drops',
        HACK_SPEED: 'Hack Speed',
        MAGIC_BARS: 'Magic Bars',
        MAGIC_CAP: 'Magic Cap',
        MAGIC_POWER: 'Magic Power',
        MAGIC_SPEED: 'Magic Speed',
        MOVE_COOLDOWN: 'Move Cooldown',
        NGU_SPEED: 'NGU Speed',
        POWER: 'Power',
        QUEST_DROP: 'Quest Drops',
        RES3_BARS: 'Resource 3 Bars',
        RES3_CAP: 'Resource 3 Cap',
        RES3_POWER: 'Resource 3 Power',
        RESPAWN: 'Respawn',
        SEED_DROP: 'Seed Gain',
        TOUGHNESS: 'Toughness',
        WANDOOS_SPEED: 'Wandoos Speed',
        WISH_SPEED: 'Wish Speed',
        YGGDRASIL_YIELD: 'Yggdrasil Yield'
}

let single_factors = {
        NONE: [
                'None', []
        ],
        RESPAWN: [
                'Respawn',
                [Stat.RESPAWN]
        ],
        POWER: [
                'Power',
                [Stat.POWER]
        ],
        TOUGHNESS: [
                'Toughness',
                [Stat.TOUGHNESS]
        ],
        DAYCARE_SPEED: [
                'Daycare',
                [Stat.DAYCARE_SPEED]
        ],
        GOLD_DROP: [
                'Gold Drops',
                [Stat.GOLD_DROP]
        ],
        DROP_CHANCE: [
                'Drop chance',
                [Stat.DROP_CHANCE]
        ],
        QUEST_DROP: [
                'Quest Drop',
                [Stat.QUEST_DROP]
        ]
}

let remaining_factors = {};

Object.keys(Stat).forEach(key => {
        if (single_factors[key] === undefined) {
                remaining_factors[key] = [
                        Stat[key],
                        [Stat[key]]
                ];
        }
});

export const multiple_factors = {
        ENGU: [
                'Energy NGU',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.NGU_SPEED
                ]
        ],
        MNGU: [
                'Magic NGU',
                [
                        Stat.MAGIC_CAP, Stat.MAGIC_POWER, Stat.NGU_SPEED
                ]
        ],
        HACK: [
                'Hacks',
                [
                        Stat.RES3_CAP, Stat.RES3_POWER, Stat.HACK_SPEED
                ]
        ],
        NGUS: [
                'NGUs',
                [
                        Stat.ENERGY_CAP,
                        Stat.ENERGY_POWER,
                        Stat.NGU_SPEED,
                        Stat.MAGIC_CAP,
                        Stat.MAGIC_POWER,
                        Stat.NGU_SPEED
                ]
        ],
        NGUSHACK: [
                'NGUs and Hacks',
                [
                        Stat.ENERGY_CAP,
                        Stat.ENERGY_POWER,
                        Stat.NGU_SPEED,
                        Stat.MAGIC_CAP,
                        Stat.MAGIC_POWER,
                        Stat.NGU_SPEED,
                        Stat.RES3_CAP,
                        Stat.RES3_POWER,
                        Stat.HACK_SPEED
                ]
        ],
        TIMEMACHINE: [
                'Time Machine',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.MAGIC_CAP, Stat.MAGIC_POWER
                ]
        ],
        WANDOOS: [
                'Wandoos',
                [
                        Stat.ENERGY_CAP, Stat.WANDOOS_SPEED, Stat.MAGIC_CAP, Stat.WANDOOS_SPEED
                ]
        ],
        AT: [
                'Advanced Training',
                [
                        Stat.ENERGY_POWER, Stat.ENERGY_CAP, Stat.ADVANCE_TRAINING
                ],
                [
                        .5, 1, 1
                ]
        ],
        EBEARD: [
                'Energy Beards',
                [
                        Stat.ENERGY_POWER, Stat.ENERGY_BARS, Stat.BEARD_SPEED
                ],
                [
                        .5, 1, 1
                ]
        ],
        MBEARD: [
                'Magic Beards',
                [
                        Stat.MAGIC_POWER, Stat.MAGIC_BARS, Stat.BEARD_SPEED
                ],
                [
                        .5, 1, 1
                ]
        ],
        ECAPSPEED: [
                'Energy Cap Speed',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_BARS
                ],
                [
                        -1, 1
                ]
        ],
        MCAPSPEED: [
                'Magic Cap Speed',
                [
                        Stat.MAGIC_CAP, Stat.MAGIC_BARS
                ],
                [
                        -1, 1
                ]
        ],
        XCAPSPEED: [
                'Resource 3 Cap Speed',
                [
                        Stat.RES3_CAP, Stat.RES3_BARS
                ],
                [
                        -1, 1
                ]
        ]
}

function extend(obj, src) {
        Object.keys(src).forEach(function(key) {
                obj[key] = src[key];
        });
        return obj;
}

export const Factors = extend(extend(single_factors, multiple_factors), remaining_factors);

export const SetName = {
        MISC: [
                'Miscellaneous', -3
        ],
        FOREST_PENDANT: [
                'Forest Pendant', -2
        ],
        LOOTY: [
                'Looty', -1
        ],
        ITOPOD: [
                'ITOPOD', 0
        ],
        SAFE: [
                'Safe Zone', 1
        ],
        TRAINING: [
                'Tutorial Zone', 2
        ],
        SEWERS: [
                'Sewers', 3
        ],
        FOREST: [
                'Forest', 4
        ],
        CAVE: [
                'Cave of Many Things', 5
        ],
        SKY: [
                'The Sky', 6
        ],
        HSB: [
                'High Security Base', 7
        ],
        GRB: [
                'Gordon Ramsay Bolton', 8
        ],
        CLOCK: [
                'Clock Dimension', 9
        ],
        GCT: [
                'Grand Corrupted Tree', 10
        ],
        TWO_D: [
                'The 2D Universe', 11
        ],
        SPOOPY: [
                'Ancient Battlefield', 12
        ],
        JAKE: [
                'Jake from Accounting', 13
        ],
        GAUDY: [
                'Ary Strange Place', 14
        ],
        MEGA: [
                'Mega Lands', 15
        ],
        UUG_RINGS: [
                'UUG, The Unmentionable', 16
        ],
        BEARDVERSE: [
                'The Beardverse', 17
        ],
        WANDERER: [
                'Walderp', 18
        ],
        WANDERER2: [
                'Walderp', 18
        ],
        BADLY_DRAWN: [
                'Badly Drawn World', 19
        ],
        STEALTH: [
                'Boring-Ass Earth', 20
        ],
        SLIMY: [
                'The Beast', 21, 1
        ],
        SLIMY2: [
                'The Beast', 21, 2
        ],
        SLIMY3: [
                'The Beast', 21, 3
        ],
        SLIMY4: [
                'The Beast', 21, 4
        ],
        CHOCO: [
                'Chocolate World', 22
        ],
        EDGY: [
                'The Evilverse', 23
        ],
        PINK: [
                'Pretty Pink Princess Land', 24
        ],
        NERD: [
                'Greasy Nerd', 25, 1
        ],
        NERD2: [
                'Greasy Nerd', 25, 2
        ],
        NERD3: [
                'Greasy Nerd', 25, 3
        ],
        NERD4: [
                'Greasy Nerd', 25, 4
        ],
        META: [
                'Meta Land', 26
        ],
        PARTY: [
                'Interdimensional Party', 27
        ],
        MOBSTER: [
                'The Godmother', 28, 1
        ],
        MOBSTER2: [
                'The Godmother', 28, 2
        ],
        MOBSTER3: [
                'The Godmother', 28, 3
        ],
        MOBSTER4: [
                'The Godmother', 28, 4
        ],
        TYPO: [
                'Typo Zonw', 29
        ],
        FAD: [
                'The Fad-lands', 30
        ],
        JRPG: [
                'JRPGVille', 31
        ],
        EXILE: [
                'The Exile', 32, 1
        ],
        EXILE2: [
                'The Exile', 32, 2
        ],
        EXILE3: [
                'The Exile', 32, 3
        ],
        EXILE4: ['The Exile', 32, 4]
}
