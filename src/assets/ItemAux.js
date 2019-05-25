export class Item {
        constructor(name, slot, zone, level, props) {
                this.name = name;
                this.slot = slot;
                this.zone = zone;
                this.level = level;
                this.stats = []
                for (let i = 0; i < props.length; i++) {
                        this.stats.push(props[i]);
                }
        }
}

export class EmptySlot extends Item {
        constructor(slot) {
                super('Empty ' + slot[0] + ' Slot', slot, undefined, 0, []);
                this.empty = true;
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

export const SetName = {
        HEART: [
                'Hearts', -4
        ],
        FOREST_PENDANT: [
                'Forest Pendants', -3
        ],
        LOOTY: [
                'Looty', -2
        ],
        OTHER: [
                'Other', -1
        ],
        ITOPOD: [
                'ITOPOD', 0
        ],
        SAFE: [
                'Safe Zone', 1
        ],
        TRAINING: [
                'Training Set', 2
        ],
        SEWERS: [
                'Sewers Set', 3
        ],
        FOREST: [
                'Forest Set', 4
        ],
        CAVE: [
                'Cave Set', 5
        ],
        SKY: [
                'The Sky', 6
        ],
        HSB: [
                'HSB Set', 7
        ],
        GRB: [
                'Gordon Ramsay bolton', 8
        ],
        CLOCK: [
                'Clock Set', 9
        ],
        GCT: [
                'Grand Corrupted Tree', 10
        ],
        TWO_D: [
                '2D Set', 11
        ],
        SPOOPY: [
                'Spoopy Set', 12
        ],
        JAKE: [
                'Jake Set', 13
        ],
        GAUDY: [
                'Gaudy Set', 14
        ],
        MEGA: [
                'Mega Set', 15
        ],
        UUG_RINGS: [
                'UUG', 16
        ],
        BEARDVERSE: [
                'Beardverse', 17
        ],
        WANDERER: [
                'Walderp', 18
        ],
        WANDERER2: [
                'Walderp', 18
        ],
        BADLY_DRAWN: [
                'Badly Drawn Set', 19
        ],
        STEALTH: [
                'Stealth Set', 20
        ],
        SLIMY: [
                'Slimy Set', 21
        ],
        CHOCO: [
                'Choco Set', 22
        ],
        EDGY: [
                'Edgy Set', 23
        ],
        PINK: [
                'Pretty Pink Princess Set', 24
        ],
        NERD: [
                'Greasy Nerd Set', 25
        ],
        META: [
                'Meta Set', 26
        ],
        PARTY: [
                'Party Set', 27
        ],
        MOBSTER: [
                'Mobster Set', 28
        ],
        TYPO: [
                'Typo Set', 29
        ],
        FAD: [
                'Fad Set', 30
        ],
        JRPG: [
                'Jrpg Set', 31
        ],
        EXILE: ['Exile Set', 32]
}
