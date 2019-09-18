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

export const ItemNameContainer = (accslots, offhand) => {
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
                if (slot === 'WEAPON' && offhand > 0) {
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
        AT_SPEED: 'Advanced Training Speed',
        AP: 'AP',
        AUGMENT_SPEED: 'Augment Speed',
        BEARD_SPEED: 'Beard Speed',
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
        DELETE: [
                'Delete priority', []
        ],
        INSERT: [
                'Insert priority', []
        ],
        POWER: [
                'Power',
                [Stat.POWER]
        ],
        TOUGHNESS: [
                'Toughness',
                [Stat.TOUGHNESS]
        ],
        RESPAWN: [
                'Respawn',
                [Stat.RESPAWN]
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
        if (key.includes('SPEED')) {
                return;
        }
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
        NGUS: [
                'NGUs',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.MAGIC_CAP, Stat.MAGIC_POWER, Stat.NGU_SPEED
                ],
                [
                        0.5, 0.5, 0.5, 0.5, 1
                ]
        ],
        HACK: [
                'Hacks',
                [
                        Stat.RES3_CAP, Stat.RES3_POWER, Stat.HACK_SPEED
                ]
        ],
        WISHES: [
                'Wishes',
                [
                        Stat.ENERGY_CAP,
                        Stat.ENERGY_POWER,
                        Stat.MAGIC_CAP,
                        Stat.MAGIC_POWER,
                        Stat.RES3_CAP,
                        Stat.RES3_POWER,
                        Stat.WISH_SPEED
                ],
                [
                        0.17,
                        0.17,
                        0.17,
                        0.17,
                        0.17,
                        0.17,
                        1
                ]
        ],
        NGUSHACK: [
                'NGUs and Hacks',
                [
                        Stat.ENERGY_CAP,
                        Stat.ENERGY_POWER,
                        Stat.MAGIC_CAP,
                        Stat.MAGIC_POWER,
                        Stat.NGU_SPEED,
                        Stat.RES3_CAP,
                        Stat.RES3_POWER,
                        Stat.HACK_SPEED
                ],
                [
                        1 / 3,
                        1 / 3,
                        1 / 3,
                        1 / 3,
                        2 / 3,
                        1 / 3,
                        1 / 3,
                        1 / 3
                ]
        ],
        TIMEMACHINE: [
                'Time Machine',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.MAGIC_CAP, Stat.MAGIC_POWER
                ]
        ],
        BLOOD: [
                'Blood Rituals',
                [
                        Stat.MAGIC_CAP, Stat.MAGIC_POWER
                ]
        ],
        EWANDOOS: [
                'Energy Wandoos',
                [
                        Stat.ENERGY_CAP, Stat.WANDOOS_SPEED
                ]
        ],
        MWANDOOS: [
                'Magic Wandoos',
                [
                        Stat.MAGIC_CAP, Stat.WANDOOS_SPEED
                ]
        ],
        WANDOOS: [
                'Wandoos',
                [
                        Stat.ENERGY_CAP, Stat.WANDOOS_SPEED, Stat.MAGIC_CAP, Stat.WANDOOS_SPEED
                ]
        ],
        AUGMENTATION: [
                'Augmentation',
                [
                        Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.AUGMENT_SPEED
                ]
        ],
        AT: [
                'Advanced Training',
                [
                        Stat.ENERGY_POWER, Stat.ENERGY_CAP, Stat.AT_SPEED
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
                'Miscellaneous', -4
        ],
        HEART: [
                'My Hearts <3', -3
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
        EXILE4: [
                'The Exile', 32, 4
        ],
        RADLANDS: [
                'The Rad Lands', 33
        ],
        BACKTOSCHOOL: [
                'Back To School', 34
        ],
        WESTWORLD: [
                'The West World', 35
        ],
        ITHUNGERS: [
                'It Hungers', 36, 1
        ],
        ITHUNGERS2: [
                'It Hungers', 36, 2
        ],
        ITHUNGERS3: [
                'It Hungers', 36, 3
        ],
        ITHUNGERS4: ['It Hungers', 36, 4]
}

export const Hacks = [
        [
                'Attack/Defense Hack',
                1.00E+08,
                2.5000,
                1.0250,
                10,
                7720
        ],
        [
                'Adventure Stats Hac',
                2.00E+08,
                0.1000,
                1.0200,
                50,
                7632
        ],
        [
                'Time Machine Speed Hack',
                4.00E+08,
                0.2000,
                1.0200,
                50,
                7544
        ],
        [
                'Drop Chance Hack',
                4.00E+08,
                0.2500,
                1.0300,
                40,
                7544
        ],
        [
                'Augment Speed Hack',
                8.00E+08,
                0.2000,
                1.0100,
                20,
                7456
        ],
        [
                'Energy NGU Speed Hack',
                2.00E+09,
                0.1000,
                1.0150,
                30,
                7340
        ],
        [
                'Magic NGU Speed Hack',
                2.00E+09,
                0.1000,
                1.0150,
                30,
                7340
        ],
        [
                'Blood Gain Hack',
                4.00E+09,
                0.1000,
                1.0200,
                50,
                7252
        ],
        [
                'QP Gain Hack',
                8.00E+09,
                0.0500,
                1.0080,
                50,
                7164
        ],
        [
                'Daycare Hack',
                2.00E+10,
                0.0200,
                1.0050,
                45,
                7048
        ],
        [
                'EXP Hack',
                4.00E+10,
                0.0250,
                1.0100,
                75,
                6960
        ],
        [
                'Number Hack',
                8.00E+10,
                5.0000,
                1.0200,
                40,
                6873
        ],
        [
                'PP Hack',
                2.00E+11,
                0.0500,
                1.0050,
                25,
                6757
        ],
        [
                'Hack Hack',
                2.00E+11,
                0.0500,
                1.1000,
                100,
                6757
        ]
];

export const Wishes = [
        //page 1
        [
                'Kick-ass', 1e15, 1
        ],
        [
                'Wish Speed I', 1e15, 10
        ],
        [
                'MacGuffin Drops', 2e15, 5
        ],
        [
                'V2/3/4 Titan Rewards', 8e15, 3
        ],
        [
                'Money Pit Sucks', 6e15, 1
        ],
        [
                'Stats I', 3e15, 10
        ],
        [
                'Adventure Stats I', 3e15, 10
        ],
        [
                'Inventory Space I', 4e15, 12
        ],
        [
                'Mega Buff', 6e15, 1
        ],
        [
                'Energy Power I', 5e15, 10
        ],
        [
                'Energy Cap I', 5e15, 10
        ],
        [
                'Energy Bars I', 5e15, 10
        ],
        [
                'Magic Power I', 5e15, 10
        ],
        [
                'Magic Cap I', 5e15, 10
        ],
        [
                'Magic Bars I', 5e15, 10
        ],
        [
                'Resource 3 Power I', 5e15, 10
        ],
        [
                'Resource 3 Cap I', 5e15, 10
        ],
        [
                'Resource 3 Bars I', 5e15, 10
        ],
        [
                'Hack Speed I', 1e16, 10
        ],
        [
                'Active Quest Reward I', 2e16, 10
        ],
        [
                'Minimal Rebirth Time', 3e16, 6
        ],
        //page 2
        [
                'Wish Speed II', 5e16, 10
        ],
        [
                'Inventory space II', 8e16, 12
        ],
        [
                'Faster Basic Training', 1e17, 1
        ],
        [
                'Blood MacGuffin α Target', 6e16, 1
        ],
        [
                'Fruit of MacGuffin α Target', 6e16, 1
        ],
        [
                'Oscar Meyer Weiner', 1e18, 1
        ],
        [
                'Daycare Kitty Happiness', 5e16, 10
        ],
        [
                'Dual Wield I', 3e17, 10
        ],
        [
                'Adventure Stats II', 2e17, 10
        ],
        [
                'Stats II', 2e17, 10
        ],
        [
                'Energy Power II', 1e17, 10
        ],
        [
                'Energy Cap II', 1e17, 10
        ],
        [
                'Energy Bars II', 1e17, 10
        ],
        [
                'Magic Power II', 1e17, 10
        ],
        [
                'Magic Cap II', 1e17, 10
        ],
        [
                'Magic Bars II', 1e17, 10
        ],
        [
                'Resource 3 Power II', 1e17, 10
        ],
        [
                'Resource 3 Cap II', 1e17, 10
        ],
        [
                'Resource 3 Bars II', 1e17, 10
        ],
        [
                'Godmother QP', 1e19, 1
        ],
        [
                'Exile QP', 3e20, 1
        ],
        // page 3
        [
                'Hack Speed II', 7e17, 10
        ],
        [
                'Wish Speed III', 2e18, 10
        ],
        [
                'Daycare Kitty Art', 3e19, 1
        ],
        [
                'Dual Wield II', 1e19, 10
        ],
        [
                'Respawn Rate', 6e18, 10
        ],
        [
                'More QP', 3e18, 10
        ],
        [
                'Energy Power III', 5e18, 10
        ],
        [
                'Energy Cap III', 5e18, 10
        ],
        [
                'Energy Bars III', 5e18, 10
        ],
        [
                'Magic Power III', 5e18, 10
        ],
        [
                'Magic Cap III', 5e18, 10
        ],
        [
                'Magic Bars III', 5e18, 10
        ],
        [
                'Resource 3 Power III', 5e18, 10
        ],
        [
                'Resource 3 Cap III', 5e18, 10
        ],
        [
                'Resource 3 Bars III', 5e18, 10
        ],
        [
                'Inventory space III', 8e19, 12
        ],
        [
                'Oh Shit', 3e21, 1
        ],
        [
                'Blood MacGuffin α Sucks', 4e20, 10
        ],
        [
                'Fruit of MacGuffin α Sucks', 4e20, 10
        ],
        [
                'Exp Bonus', 8e19, 10
        ],
        [
                'Active Quests II', 8e20, 10
        ],
        // page 4
        [
                'Hack Speed III', 5e20, 10
        ],
        [
                'Energy Power IV', 3e20, 10
        ],
        [
                'Energy Cap IV', 3e20, 10
        ],
        [
                'Energy Bars IV', 3e20, 10
        ],
        [
                'Magic Power IV', 3e20, 10
        ],
        [
                'Magic Cap IV', 3e20, 10
        ],
        [
                'Magic Bars IV', 3e20, 10
        ],
        [
                'Resource 3 Power IV', 3e20, 10
        ],
        [
                'Resource 3 Cap IV', 3e20, 10
        ],
        [
                'Resource 3 Bars IV', 3e20, 10
        ],
        [
                'Beast QP', 2e16, 1
        ],
        [
                'Greasy Nerd QP', 5.00E+17, 1
        ],
        [
                'Seek help.', 5.00E+21, 1
        ],
        [
                'QP Hack Milestone I', 2.00E+17, 5
        ],
        [
                'Number Hack Milestone I', 1.00E+19, 5
        ],
        [
                'Hack Hack Milestone I', 6.00E+20, 10
        ],
        [
                'More Base PP', 2.00E+21, 10
        ],
        [
                'Higher level quest drops I', 5.00E+17, 2
        ],
        [
                'Higher level quest drops II', 1.00E+22, 2
        ],
        [
                'Energy Power V', 5.00E+21, 10
        ],
        [
                'Energy Bars V', 5.00E+21, 10
        ],
        [
                'Energy Cap V', 5.00E+21, 10
        ],
        [
                'Magic Power V', 5.00E+21, 10
        ],
        [
                'Magic Bars V', 5.00E+21, 10
        ],
        [
                'Magic Cap V', 5.00E+21, 10
        ],
        [
                'Resource 3 Power V', 5.00E+21, 10
        ],
        [
                'Resource 3 Bars V', 5.00E+21, 10
        ],
        [
                'Resource 3 Cap V', 5.00E+21, 10
        ],
        [
                'Energy Power VI', 1.00E+23, 10
        ],
        [
                'Energy Bars VI', 1.00E+23, 10
        ],
        [
                'Energy Cap VI', 1.00E+23, 10
        ],
        [
                'Magic Power VI', 1.00E+23, 10
        ],
        [
                'Magic Bars VI', 1.00E+23, 10
        ],
        [
                'Magic Cap VI', 1.00E+23, 10
        ],
        [
                'Resource 3 Power VI', 1.00E+23, 10
        ],
        [
                'Resource 3 Bars VI', 1.00E+23, 10
        ],
        [
                'Resource 3 Cap VI', 1.00E+23, 10
        ],
        [
                'Titan 10 QP', 5.00E+22, 1
        ],
        [
                'Major Quests Base QP', 1.00E+22, 10
        ],
        [
                'Minor Quests Base QP', 1.80E+23, 2
        ],
        [
                'Adventure Stats III', 1.00E+19, 10
        ],
        [
                'Adventure Stats IV', 3.00E+21, 10
        ],
        [
                'Stats III', 2.00E+19, 10
        ],
        [
                'Stats IV', 1.00E+21, 10
        ],
        [
                'Sadistic Boss Multiplier I ', 2.00E+22, 10
        ],
        [
                'Sadistic Boss Multiplier II ', 5.00E+23, 10
        ],
        [
                'Accessory Slot', 5.00E+24, 1
        ]
];

export const resource_priorities = [
        [
                1, 0, 2
        ],
        [
                1, 2, 0
        ],
        [
                2, 1, 0
        ],
        [
                0, 1, 2
        ],
        [
                2, 0, 1
        ],
        [
                0, 2, 1
        ]
];
