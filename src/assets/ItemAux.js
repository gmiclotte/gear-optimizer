export class Item {
    constructor(id, name, slot, zone, level, props) {
        this.id = id;
        this.name = name;
        this.slot = slot;
        this.zone = zone;
        this.level = level;
        this.statnames = []
        this.base = {}
        this.disable = false;
        for (let i = 0; i < props.length; i++) {
            this.statnames.push(props[i][0]);
            this[props[i][0]] = props[i][1] * (1 + level / 100);
            this.base[props[i][0]] = props[i][1];
        }
    }
}

export function update_level(item, level) {
    for (let stat in item.base) {
        item[stat] = item.base[stat] * (1 + level / 100);
    }
    item.level = level;
}

/**
 * @return {string}
 */
export function EmptySlotName(slotname) {
    return 'Empty ' + slotname[0].toUpperCase() + slotname.substring(1) + ' Slot';
}

/**
 * @return {number}
 */
export function EmptySlotId(slotname) {
    if (slotname === 'weapon') {
        return 10000 + 0;
    }
    if (slotname === 'head') {
        return 10000 + 1;
    }
    if (slotname === 'armor') {
        return 10000 + 2;
    }
    if (slotname === 'pants') {
        return 10000 + 3;
    }
    if (slotname === 'boots') {
        return 10000 + 4;
    }
    if (slotname === 'accessory') {
        return 10000 + 5;
    }
    if (slotname === 'other') {
        return 10000 + 6;
    }
    return 10000 - 1
}

export class EmptySlot extends Item {
    constructor(slot) {
        if (slot === undefined) {
            super('', 'Empty Slot', slot, SetName.SAFE, 100, []);
        } else {
            super(EmptySlotId(slot[0]), EmptySlotName(slot[0]), slot, SetName.SAFE, 100, []);
        }
        this.empty = true;
    }
}

export class Equip extends Item {
    constructor() {
        super(100000, 'total', undefined, undefined, 100, []);
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
                list.push(new EmptySlot(Slot[slot]).id);
            }
        } else if (slot === 'OTHER') {
            list.push(1000);
            list.push(1001);
        } else {
            list.push(new EmptySlot(Slot[slot]).id);
            if (slot === 'WEAPON' && offhand > 0) {
                list.push(new EmptySlot(Slot[slot]).id);
            }
        }
        container[slotname] = list;
    }
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
    ACCESSORY: [
        'accessory', 5
    ],
    OTHER: [
        'other', 6
    ]
}

export const Stat = {
    // adventure
    POWER: 'Power',
    TOUGHNESS: 'Toughness',
    MOVE_COOLDOWN: 'Move Cooldown',
    RESPAWN: 'Respawn',
    DAYCARE_SPEED: 'Daycare Speed',
    // Drop
    GOLD_DROP: 'Gold Drops',
    DROP_CHANCE: 'Drop Chance',
    QUEST_DROP: 'Quest Drops',
    // Ygg
    SEED_DROP: 'Seed Gain',
    YGGDRASIL_YIELD: 'Yggdrasil Yield',
    // E
    ENERGY_BARS: 'Energy Bars',
    ENERGY_CAP: 'Energy Cap',
    ENERGY_POWER: 'Energy Power',
    ENERGY_SPEED: 'Energy Speed',
    // M
    MAGIC_BARS: 'Magic Bars',
    MAGIC_CAP: 'Magic Cap',
    MAGIC_POWER: 'Magic Power',
    MAGIC_SPEED: 'Magic Speed',
    // R
    RES3_BARS: 'Resource 3 Bars',
    RES3_CAP: 'Resource 3 Cap',
    RES3_POWER: 'Resource 3 Power',
    // raw speed
    AT_SPEED: 'Raw AT Speed',
    AUGMENT_SPEED: 'Raw Augment Speed',
    BEARD_SPEED: 'Raw Beard Speed',
    HACK_SPEED: 'Raw Hack Speed',
    NGU_SPEED: 'Raw NGU Speed',
    WANDOOS_SPEED: 'Raw Wandoos Speed',
    WISH_SPEED: 'Raw Wish Speed',
    // junk
    AP: 'AP',
    EXPERIENCE: 'Experience',
    COOKING: 'Cooking'
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
    MOVE_COOLDOWN: [
        'Move Cooldown',
        [Stat.MOVE_COOLDOWN]
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
            1 / 2,
            1 / 2,
            1 / 2,
            1 / 2,
            1
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
    NGUWISH: [
        'NGUs and Wishes',
        [
            Stat.ENERGY_CAP,
            Stat.ENERGY_POWER,
            Stat.MAGIC_CAP,
            Stat.MAGIC_POWER,
            Stat.NGU_SPEED,
            Stat.RES3_CAP,
            Stat.RES3_POWER,
            Stat.WISH_SPEED
        ],
        [
            1.17 / 3,
            1.17 / 3,
            1.17 / 3,
            1.17 / 3,
            2 / 3,
            0.17 / 3,
            0.17 / 3,
            1 / 3
        ]
    ],
    WISHHACK: [
        'Wishes and Hacks',
        [
            Stat.ENERGY_CAP,
            Stat.ENERGY_POWER,
            Stat.MAGIC_CAP,
            Stat.MAGIC_POWER,
            Stat.RES3_CAP,
            Stat.RES3_POWER,
            Stat.HACK_SPEED,
            Stat.WISH_SPEED
        ],
        [
            0.17 / 2,
            0.17 / 2,
            0.17 / 2,
            0.17 / 2,
            1.17 / 2,
            1.17 / 2,
            1 / 2,
            1 / 2
        ]
    ],
    ETIMEMACHINE: [
        'Energy Time Machine',
        [
            Stat.ENERGY_CAP, Stat.ENERGY_POWER
        ]
    ],
    MTIMEMACHINE: [
        'Magic Time Machine',
        [
            Stat.MAGIC_CAP, Stat.MAGIC_POWER
        ]
    ],
    TIMEMACHINE: [
        'Time Machine',
        [
            Stat.ENERGY_CAP, Stat.ENERGY_POWER, Stat.MAGIC_CAP, Stat.MAGIC_POWER
        ],
        [
            1 / 2,
            1 / 2,
            1 / 2,
            1 / 2
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
        ],
        [
            1 / 2,
            1 / 2,
            1 / 2,
            1 / 2
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
            1 / 2,
            1,
            1
        ]
    ],
    EBEARD: [
        'Energy Beards',
        [
            Stat.ENERGY_POWER, Stat.ENERGY_BARS, Stat.BEARD_SPEED
        ],
        [
            1 / 2,
            1,
            1
        ]
    ],
    MBEARD: [
        'Magic Beards',
        [
            Stat.MAGIC_POWER, Stat.MAGIC_BARS, Stat.BEARD_SPEED
        ],
        [
            1 / 2,
            1,
            1
        ]
    ],
    BEARD: [
        'Beards',
        [
            Stat.ENERGY_POWER, Stat.ENERGY_BARS, Stat.MAGIC_POWER, Stat.MAGIC_BARS, Stat.BEARD_SPEED
        ],
        [
            1 / 4,
            1 / 2,
            1 / 4,
            1 / 2,
            1
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
    ],
    EMPC: [
        'EMPC',
        [
            Stat.ENERGY_POWER, Stat.ENERGY_CAP, Stat.MAGIC_POWER, Stat.MAGIC_CAP
        ]
    ]
}

function extend(obj, src) {
    Object.keys(src).forEach(function (key) {
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
        'A Very Strange Place', 14
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
    ITHUNGERS4: [
        'It Hungers', 36, 4
    ],
    BREADVERSE: [
        'The Breadverse', 37
    ],
    SEVENTIES: [
        'That 70\'s Zone', 38
    ],
    HALLOWEEN: [
        'The Halloweenies', 39
    ],
    ROCKLOBSTER: [
        'Rock Lobster', 40, 1
    ],
    ROCKLOBSTER2: [
        'Rock Lobster', 40, 2
    ],
    ROCKLOBSTER3: [
        'Rock Lobster', 40, 3
    ],
    ROCKLOBSTER4: [
        'Rock Lobster', 40, 4
    ],
    CONSTRUCTION: [
        'Construction Zone', 41
    ],
    DUCK: [
        'DUCK DUCK ZONE', 42
    ],
    NETHER: [
        'The Nether Regions', 43
    ],
    AMALGAMATE: [
        'Amalgamate', 44, 1
    ],
    AMALGAMATE2: [
        'Amalgamate', 44, 2
    ],
    AMALGAMATE3: [
        'Amalgamate', 44, 3
    ],
    AMALGAMATE4: [
        'Amalgamate', 44, 4
    ],
    PIRATE: [
        'The Aethereal Sea Part 1', 45
    ],
}

export const Hacks = [
    [
        'Stats',
        1.00E+08,
        2.5000,
        1.0250,
        10,
        7720
    ],
    [
        'Adventure',
        2.00E+08,
        0.1000,
        1.0200,
        50,
        7632
    ],
    [
        'TM',
        4.00E+08,
        0.2000,
        1.0200,
        50,
        7544
    ],
    [
        'Drop',
        4.00E+08,
        0.2500,
        1.0300,
        40,
        7544
    ],
    [
        'Augment',
        8.00E+08,
        0.2000,
        1.0100,
        20,
        7456
    ],
    [
        'ENGU',
        2.00E+09,
        0.1000,
        1.0150,
        30,
        7340
    ],
    [
        'MNGU',
        2.00E+09,
        0.1000,
        1.0150,
        30,
        7340
    ],
    [
        'Blood',
        4.00E+09,
        0.1000,
        1.0400,
        50,
        7252
    ],
    [
        'QP',
        8.00E+09,
        0.0500,
        1.0080,
        50,
        7164
    ],
    [
        'Daycare',
        2.00E+10,
        0.0200,
        1.0050,
        45,
        7048
    ],
    [
        'EXP',
        4.00E+10,
        0.0250,
        1.0100,
        75,
        6960
    ],
    [
        'Number',
        8.00E+10,
        5.0000,
        1.0400,
        40,
        6873
    ],
    [
        'PP',
        2.00E+11,
        0.0500,
        1.0050,
        25,
        6757
    ],
    [
        'Hack',
        2.00E+11,
        0.0500,
        1.1000,
        100,
        6757
    ],
    [
        'Wish',
        1.00E+13,
        0.0100,
        1.0050,
        50,
        6262
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
        'Sadistic Boss Multiplier I', 2.00E+22, 10
    ],
    [
        'Sadistic Boss Multiplier II', 5.00E+23, 10
    ],
    [
        'Accessory Slot', 5.00E+24, 1
    ],
    [
        'Cube Boosting I', 4.00E+19, 20
    ],
    [
        'ENGU speed I', 7.00E+20, 10
    ],
    [
        'ENGU speed II', 2.00E+22, 10
    ],
    [
        'MNGU speed I', 7.00E+20, 10
    ],
    [
        'MNGU speed II', 2.00E+22, 10
    ],

    [
        'Energy NGU Card I', 4.00E+19, 1
    ],
    [
        'Drop Chance Card I', 4.00E+19, 1
    ],
    [
        'Wandoos Card I', 2.00E+19, 1
    ],
    [
        'Adventure Stats Card I', 8.00E+19, 1
    ],
    [
        'Hacks Card I', 5.00E+19, 1
    ],
    [
        'Augment Card I', 6.00E+19, 1
    ],
    [
        'Gold Drop Card I', 8.00E+19, 1
    ],
    [
        'PP Card I', 1.00E+20, 1
    ],
    [
        'A / D Card I', 9.00E+19, 1
    ],
    [
        'Magic NGU Card I', 1.90E+20, 1
    ],
    [
        'TM Speed Card I', 1.70E+20, 1
    ],
    [
        'QP Card I', 2.20E+20, 1
    ],
    [
        'Daycare Card I', 2.50E+20, 1
    ],
    [
        'Energy NGU Card II', 1.20E+21, 1
    ],
    [
        'Drop Chance Card II', 1.20E+21, 1
    ],
    [
        'Wandoos Card II', 1.00E+21, 1
    ],
    [
        'Adventure Stats Card II', 1.50E+21, 1
    ],
    [
        'Hacks Card II', 1.80E+21, 1
    ],
    [
        'Augment Card II', 1.80E+21, 1
    ],
    [
        'Gold Drop Card II', 2.00E+21, 1
    ],
    [
        'PP Card II', 2.50E+21, 1
    ],
    [
        'A / D Card II', 2.00E+21, 1
    ],
    [
        'Magic NGU Card II', 3.00E+21, 1
    ],
    [
        'TM Speed Card II', 2.50E+21, 1
    ],
    [
        'QP Tier II', 4.00E+21, 1
    ],
    [
        'Daycare Card II', 5.00E+21, 1
    ],
    [
        'Energy NGU Card III', 2.00E+22, 1
    ],
    [
        'Drop Chance Card III', 1.80E+22, 1
    ],
    [
        'Wandoos Card III', 1.50E+22, 1
    ],
    [
        'Adventure Stats Card III', 5.00E+22, 1
    ],
    [
        'Hacks Card III', 4.00E+22, 1
    ],
    [
        'Augment Card III', 6.00E+22, 1
    ],
    [
        'Gold Drop Card III', 7.50E+22, 1
    ],
    [
        'PP Card III', 1.00E+23, 2
    ],
    [
        'A / D Card III', 8.00E+22, 1
    ],
    [
        'Magic NGU Card III', 1.30E+23, 1
    ],
    [
        'TM Speed Card III', 1.20E+23, 1
    ],
    [
        'QP Card III', 1.50E+23, 2
    ],
    [
        'Daycare Card III', 1.60E+23, 1
    ],
    [
        'Faster Mayo I', 5.00E+20, 10
    ],
    [
        'Faster Cards I', 5.00E+20, 10
    ],
    [
        'Faster Mayo II', 1.00E+22, 10
    ],
    [
        'Faster Cards II', 1.00E+22, 10
    ],
    [
        'Faster Mayo III', 2.00E+23, 10
    ],
    [
        'Faster Cards III', 2.00E+23, 10
    ],
    [
        'Faster Mayo IV', 4.00E+24, 10
    ],
    [
        'Faster Cards IV', 4.00E+24, 10
    ],
    [
        'BEEFY I', 4.00E+24, 1
    ],
    [
        'WIMPY I', 4.00E+24, 1
    ],
    [
        'Bigger Deck I', 1.00E+20, 5
    ],
    [
        'Bigger Deck II', 5.00E+21, 5
    ],
    [
        'Bigger Deck III', 2.50E+23, 5
    ],
    [
        'Mayo Generator', 5.00E+21, 1
    ],
    [
        'Bonus Tag', 3.00E+22, 1
    ],
    [
        'Better Tags I', 2.00E+19, 10
    ],
    [
        'Better Tags II', 6.00E+20, 10
    ],
    [
        'Better Tags III', 1.80E+22, 10
    ],
    [
        'Better Tags IV', 5.00E+23, 10
    ],
    [
        'Better Tags V', 1.50E+25, 10
    ],
    [
        'Energy NGU Card IV', 2.50E+23, 2
    ],
    [
        'Drop Chance Card IV', 2.20E+23, 2
    ],
    [
        'Wandoos Card IV', 2.00E+23, 2
    ],
    [
        'Adventure Stats Card IV', 5.00E+23, 2
    ],
    [
        'Hacks Card IV', 4.00E+23, 2
    ],
    [
        'Augment Card IV', 6.00E+23, 2
    ],
    [
        'Gold Drop Card IV', 7.50E+23, 2
    ],
    [
        'PP Card IV', 1.00E+24, 2
    ],
    [
        'A / D Card IV', 8.00E+23, 2
    ],
    [
        'Magic NGU Card IV', 1.30E+24, 2
    ],
    [
        'TM Speed Card IV', 1.20E+24, 2
    ],
    [
        'QP Card IV', 1.50E+24, 2
    ],
    [
        'Daycare Card IV', 1.60E+24, 2
    ],
    [
        'Titan 11 QP', 2.00E+25, 1
    ],
    [
        'Adventure Stats V', 1.00E+24, 20
    ],
    [
        'Stats V', 1.00E+24, 20
    ],
    [
        'F**king Done With AT', 1.00E+18, 1
    ],
    [
        'Stats VI', 2.00E+25, 20
    ],
    [
        'Stats VII', 4.00E+26, 20
    ],
    [
        'Energy Power VII', 2.00E+24, 10
    ],
    [
        'Energy Bars VII', 2.00E+24, 10
    ],
    [
        'Energy Cap VII', 2.00E+24, 10
    ],
    [
        'Magic Power VII', 2.00E+24, 10
    ],
    [
        'Magic Bars VII', 2.00E+24, 10
    ],
    [
        'Magic Cap VII', 2.00E+24, 10
    ],
    [
        'Resource 3 Power VII', 2.00E+24, 10
    ],
    [
        'Resource 3 Bars VII', 2.00E+24, 10
    ],
    [
        'Resource 3 Cap VII', 2.00E+24, 10
    ],
    [
        'Sneak Preview', 1.00E+24, 1
    ],
    [
        'SHUT DOWN', 1.00E+27, 1
    ],
    [
        'Titan 12 QP', 3.00E+26, 1
    ],
    [
        'Energy NGU Card V', 4.00E+25, 2
    ],
    [
        'Drop Chance Card V', 5.00E+25, 2
    ],
    [
        'Wandoos Card V', 4.00E+25, 2],
    [
        'Adventure Stats Card V', 1.00E+26, 2
    ],
    [
        'Hacks Card V', 8.00E+25, 2
    ],
    [
        'Augment Card V', 1.00E+26, 2
    ],
    [
        'Gold Drop Card V', 1.30E+26, 2
    ],
    [
        'PP Card V', 2.00E+26, 2
    ],
    [
        'A / D Card V', 2.50E+26, 2
    ],
    [
        'Magic NGU Card V', 2.00E+26, 2
    ],
    [
        'TM Speed Card V', 3.00E+26, 2
    ],
    [
        'QP Card V', 5.00E+26, 2
    ],
    [
        'Daycare Card V', 4.00E+26, 2
    ],
    [
        'Adventure Stats VI', 5.00E+25, 20
    ],
    [
        'Stats VIII', 1.80E+26, 20
    ],
    [
        'BEEFY II', 1.00E+26, 1
    ],
    [
        'WIMPY II', 1.00E+26, 1
    ],
    [
        'Faster Mayo V', 8.00E+25, 10
    ],
    [
        'Faster CardsV', 8.00E+25, 10
    ],
    [
        'Faster Mayo VI', 1.00E+27, 10
    ],
    [
        'Faster Cards VI', 1.00E+27, 10
    ],
    [
        'Adventure Stats VI (part 2)', 3.30E+26, 10
    ],
    [
        'BEEFY III', 3.80E+26, 2
    ],
    [
        'WIMPY III', 3.50E+26, 2
    ],
    [
        'CHONKIER', 3.40E+26, 5
    ],
    [
        'LESS NOT CHONKIER', 3.70E+26, 5
    ],
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

const vngu = (cost, bonus, softcap, scbonus, scexponent) => {
    return {cost: cost, bonus: bonus, softcap: softcap, scbonus: scbonus, scexponent: scexponent};
};
const ngu = (name, nc, nb, nsc, nscb, nsce, ec, eb, esc, escb, esce, sc, sb, ssc, sscb, ssce) => {
    return {
        name: name,
        normal: vngu(nc, nb, nsc, nscb, nsce),
        evil: vngu(ec, eb, esc, escb, esce),
        sadistic: vngu(sc, sb, ssc, sscb, ssce)
    };
};

export const NGUs = {
    energy: [
        ngu('Augments', 1.00E+13, 1.00E-02, 1.00E+09, 0, 0.00E+00, 1.00E+22, 5.00E-03, 1.00E+09, 0, 0.00E+00, 1.00E+33, 4.00E-03, 1.00E+09, 0, 0.00E+00),
        ngu('Wandoos', 1.00E+13, 1.00E-03, 1.00E+09, 0, 0.00E+00, 1.00E+22, 1.00E-03, 1.00E+03, 177.9, 2.50E-01, 1.00E+33, 6.00E-04, 1.00E+03, 354.81, 1.50E-01),
        ngu('Respawn', 1.00E+13, 5.00E-04, 4.00E+02, 5, 2.00E-01, 1.00E+22, 5.00E-06, 1.00E+04, 20, 5.00E-02, 1.00E+33, 5.00E-06, 1.00E+04, 20, 5.00E-02),
        ngu('Gold', 1.00E+13, 1.00E-02, 1.00E+09, 0, 0.00E+00, 1.00E+23, 5.00E-03, 1.00E+09, 0, 0.00E+00, 1.00E+33, 5.00E-03, 1.00E+03, 31.63, 5.00E-01),
        ngu('Adventure α', 1.00E+13, 1.00E-03, 1.00E+03, 31.7, 5.00E-01, 1.00E+24, 5.00E-04, 1.00E+03, 177.9, 2.50E-01, 1.00E+34, 4.00E-04, 1.00E+03, 251.19, 2.00E-01),
        ngu('Power α', 1.00E+13, 5.00E-02, 1.00E+09, 0, 0.00E+00, 1.00E+25, 2.00E-02, 1.00E+09, 0, 0.00E+00, 1.00E+35, 1.60E-02, 1.00E+09, 0, 0.00E+00),
        ngu('Drop Chance', 1.00E+15, 1.00E-03, 1.00E+03, 31.7, 5.00E-01, 1.00E+26, 5.00E-04, 1.00E+03, 125.9, 3.00E-01, 1.00E+36, 4.00E-04, 1.00E+03, 251.2, 2.00E-01),
        ngu('Magic NGU', 2.00E+16, 1.00E-03, 1.00E+03, 125.9, 3.00E-01, 1.00E+27, 5.00E-04, 1.00E+03, 125.9, 3.00E-01, 1.00E+37, 4.00E-04, 1.00E+03, 501.19, 1.00E-01),
        ngu('PP', 5.00E+17, 5.00E-04, 1.00E+03, 125.9, 3.00E-01, 1.01E+28, 2.00E-04, 1.00E+03, 251.2, 2.00E-01, 1.00E+38, 1.60E-04, 1.00E+03, 501.21, 1.00E-01)
    ],
    magic: [
        ngu('Yggdrasil', 2.00E+13, 1.00E-03, 4.00E+02, 55.4, 3.30E-01, 1.00E+22, 5.00E-04, 4.00E+02, 219.72, 1.00E-01, 1.00E+33, 4.00E-04, 4.00E+02, 247.69, 8.00E-02),
        ngu('Exp', 6.00E+13, 1.00E-04, 2.00E+03, 95.66, 4.00E-01, 1.00E+23, 5.00E-05, 2.00E+03, 437.35, 2.00E-01, 1.00E+33, 5.00E-05, 2.00E+03, 639.56, 1.50E-01),
        ngu('Power β', 2.00E+14, 1.00E-02, 1.00E+09, 0, 0.00E+00, 1.00E+24, 5.00E-03, 1.00E+09, 0, 0.00E+00, 1.00E+34, 5.00E-03, 1.00E+09, 0, 0.00E+00),
        ngu('Number', 6.00E+14, 1.00E-02, 1.00E+03, 31.7, 5.00E-01, 1.00E+25, 5.00E-03, 1.00E+03, 125.9, 3.00E-01, 1.00E+35, 5.00E-03, 1.00E+03, 251.2, 2.00E-01),
        ngu('Time Machine', 5.00E+15, 2.00E-03, 1.00E+03, 3.981, 8.00E-01, 1.00E+26, 1.00E-03, 1.00E+03, 3.981, 8.00E-01, 1.00E+36, 1.00E-03, 1.00E+03, 3.981, 8.00E-01),
        ngu('Energy NGU', 5.00E+16, 1.00E-03, 1.00E+03, 125.9, 3.00E-01, 1.00E+27, 5.00E-04, 1.00E+03, 251.2, 2.00E-01, 1.00E+37, 5.00E-04, 1.00E+03, 354.82, 1.50E-01),
        ngu('Adventure β', 5.00E+17, 3.00E-04, 1.00E+03, 63.13, 4.00E-01, 1.01E+28, 1.50E-04, 1.00E+03, 177.83, 2.50E-01, 1.00E+38, 1.50E-04, 1.00E+03, 436.53, 1.20E-01)
    ]
};
