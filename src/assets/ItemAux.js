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
                        super('Empty Slot', slot, undefined, 0, []);
                } else {
                        super('Empty ' + slot[0] + ' Slot', slot, undefined, 0, []);
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

export const Slot = {
        WEAPON: [
                'Weapon', 0
        ],
        HEAD: [
                'Head', 1
        ],
        CHEST: [
                'Armor', 2
        ],
        PANTS: [
                'Pants', 3
        ],
        BOOTS: [
                'Boots', 4
        ],
        ACCESSORY: ['Accessory', 5]
}

export const Stat = {
        ADVANCE_TRAINING: 'Advance Training',
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
        RES3_BARS: 'Res3 Bars',
        RES3_CAP: 'Res3 Cap',
        RES3_POWER: 'Res3 Power',
        RESPAWN: 'Respawn',
        SEED_DROP: 'Seed Gain',
        TOUGHNESS: 'Toughness',
        WANDOOS_SPEED: 'Wandoos Speed',
        WISH_SPEED: 'Wish Speed',
        YGGDRASIL_YIELD: 'Yggdrasil Yield'
}

export const Factors = {
        NONE: [
                'None', []
        ],
        RESPAWN: [
                'Respawn',
                [Stat.RESPAWN]
        ],
        DAYCARE_SPEED: [
                'Daycare',
                [Stat.DAYCARE_SPEED]
        ],
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
        ]
}

export const SetName = {
        HEART: [
                'Sellout Shop', -3
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
                'The Beast', 21
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
                'Greasy Nerd', 25
        ],
        META: [
                'Meta Land', 26
        ],
        PARTY: [
                'Interdimensional Party', 27
        ],
        MOBSTER: [
                'The Godmother', 28
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
        EXILE: ['The Exile', 32]
}
