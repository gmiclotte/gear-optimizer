STATS = [
    ['AdvTraining', 'AT_SPEED', 1e2],
    ['AdvTraining2', 'AT_SPEED', 1e4],
    ['AllCap', 'ALL_CAP', 1e4],
    ['AllPerBar', 'ALL_BARS', 1e3],
    ['AllPower', 'ALL_POWER', 1e3],
    ['AP', 'AP', 1e4],
    ['Augs', 'AUGMENT_SPEED', 1e4],
    ['Beards', 'BEARD_SPEED', 1e3],
    ['Beards2', 'BEARD_SPEED', 1e4],
    ['Cooking', 'COOKING', 1],
    ['DaycareSpeed', 'DAYCARE_SPEED', 1e5],
    ['Looting', 'DROP_CHANCE', 10],
    ['Looting2', 'DROP_CHANCE', 1e4],
    ['EnergyPerBar', 'ENERGY_BARS', 1],
    ['EnergyPerBar2', 'ENERGY_BARS', 10],
    ['EnergyPerBar3', 'ENERGY_BARS', 1e3],
    ['EnergyCap', 'ENERGY_CAP', 1e2],
    ['EnergyCap3', 'ENERGY_CAP', 1e4],
    ['EnergyPower', 'ENERGY_POWER', 1],
    ['EnergyPower2', 'ENERGY_POWER', 10],
    ['EnergyPower3', 'ENERGY_POWER', 1e3],
    ['EnergySpeed', 'ENERGY_SPEED', 1],
    ['EXP', 'EXPERIENCE', 1e4],
    ['GoldDropAmount', 'GOLD_DROP', 1],
    ['GoldDrop2', 'GOLD_DROP', 1e3],
    ['HackSpeed', 'HACK_SPEED', 1e7],
    ['MagicPerBar', 'MAGIC_BARS', 1],
    ['MagicPerBar2', 'MAGIC_BARS', 10],
    ['MagicPerBar3', 'MAGIC_BARS', 1e3],
    ['MagicCap', 'MAGIC_CAP', 1e2],
    ['MagicCap3', 'MAGIC_CAP', 1e4],
    ['MagicPower', 'MAGIC_POWER', 1],
    ['MagicPower2', 'MAGIC_POWER', 10],
    ['MagicPower3', 'MAGIC_POWER', 1e3],
    ['MagicSpeed', 'MAGIC_SPEED', 1],
    ['Cooldown', 'MOVE_COOLDOWN', 1e2],
    ['NGU', 'NGU_SPEED', 1e2],
    ['NGU2', 'NGU_SPEED', 1e4],
    ['POWER', 'POWER', 1],
    ['QuestDrop', 'QUEST_DROP', 1e6],
    ['Res3Bar', 'RES3_BARS', 1e6],
    ['Res3Cap', 'RES3_CAP', 1e7],
    ['Res3Power', 'RES3_POWER', 1e6],
    ['Respawn', 'RESPAWN', 1e3],
    ['Seeds', 'SEED_DROP', 1e3],
    ['TOUGHNESS', 'TOUGHNESS', 1],
    ['Wandoos98', 'WANDOOS_SPEED', 1e2],
    ['Wandoos2', 'WANDOOS_SPEED', 1e4],
    ['WishSpeed', 'WISH_SPEED', 1e7],
    ['Yggdrasil', 'YGGDRASIL_YIELD', 1e5],
]


def spec2stat(val):
    for idx in range(len(STATS)):
        if val[9:] == STATS[idx][0]:
            return STATS[idx]
    return [val, val, 1]


def f2i(val):
    return int(float(val[:-1]))


SLOTS = ['MISC', 'WEAPON', 'HEAD', 'CHEST', 'PANTS', 'BOOTS', 'ACCESSORY']


def part2slot(val):
    for idx in range(len(SLOTS)):
        if val[5:].lower() == SLOTS[idx].lower():
            return SLOTS[idx]
        if val[5:] == 'Legs':
            return 'PANTS'
        if val[5:] in ['MacGuffin', 'atkBoost', 'defBoost', 'specBoost']:
            return 'MISC'
    return val


ZONES = [
    ['A Triangle', 'SetName.TWO_D'],
    ['Circle Helmet', 'SetName.TWO_D'],
    ['Square Chestpiece', 'SetName.TWO_D'],
    ['Rectangle Pants', 'SetName.TWO_D'],
    ['Polygon Boots', 'SetName.TWO_D'],
    ['THE CUBE', 'SetName.TWO_D'],
    ['King Circle\'s Amulet of Helping Random Stuff', 'SetName.TWO_D'],
    ['Badly Drawn Gun', 'SetName.BADLY_DRAWN'],
    ['Badly Drawn Smiley Face', 'SetName.BADLY_DRAWN'],
    ['Badly Drawn Chest', 'SetName.BADLY_DRAWN'],
    ['Badly Drawn Pants', 'SetName.BADLY_DRAWN'],
    ['Badly Drawn Foot', 'SetName.BADLY_DRAWN'],
    ['Bearded Axe', 'SetName.BEARDVERSE'],
    ['Groucho Marx Disguise', 'SetName.BEARDVERSE'],
    ['Gossamer Chest', 'SetName.BEARDVERSE'],
    ['Braided Beard Legs', 'SetName.BEARDVERSE'],
    ['Fuzzy Orange Cheeto Slippers!', 'SetName.BEARDVERSE'],
    ['An Infinitely Long Strand of Beard Hair', 'SetName.BEARDVERSE'],
    ['My Blue Heart <3', 'SetName.HEART'],
    ['My Brown Heart <3', 'SetName.HEART'],
    ['My Green Heart <3', 'SetName.HEART'],
    ['My Red Heart <3', 'SetName.HEART'],
    ['My Yellow Heart <3', 'SetName.HEART'],
    ['My Orange Heart <3', 'SetName.HEART'],
    ['My Purple Heart <3', 'SetName.HEART'],
    ['My Grey Heart <3', 'SetName.HEART'],
    ['My Pink Heart <3', 'SetName.HEART'],
    ['Mole Hammer', 'SetName.CAVE'],
    ['Blue Cheese Helmet', 'SetName.CAVE'],
    ['Gouda Chestplate', 'SetName.CAVE'],
    ['Swiss Leggings', 'SetName.CAVE'],
    ['Limburger Boots', 'SetName.CAVE'],
    ['Havarti Ring', 'SetName.CAVE'],
    ['Cheddar Amulet', 'SetName.CAVE'],
    ['Combat Cheese', 'SetName.CAVE'],
    ['Chocolate Crowbar', 'SetName.CHOCO'],
    ['Magic Bar Bar', 'SetName.CHOCO'],
    ['Energy Bar Bar', 'SetName.CHOCO'],
    ['Chocolate Helmet', 'SetName.CHOCO'],
    ['Chocolate Chest', 'SetName.CHOCO'],
    ['Chocolate Pants', 'SetName.CHOCO'],
    ['Chocolate Boots', 'SetName.CHOCO'],
    ['A Comically Oversized Minute-Hand', 'SetName.CLOCK'],
    ['Clockwork Hat', 'SetName.CLOCK'],
    ['Clockwork Chest', 'SetName.CLOCK'],
    ['Clockwork Pants', 'SetName.CLOCK'],
    ['Clockwork Boots', 'SetName.CLOCK'],
    ['Alarm Clock', 'SetName.CLOCK'],
    ['The Sands of Time', 'SetName.CLOCK'],
    ['Kokiri Blade', 'SetName.FOREST'],
    ['Forest Helmet', 'SetName.FOREST'],
    ['Forest Chestplate', 'SetName.FOREST'],
    ['Forest Leggings', 'SetName.FOREST'],
    ['Forest Boots', 'SetName.FOREST'],
    ['Mossy Ring', 'SetName.FOREST'],
    ['Paper Fan', 'SetName.GAUDY'],
    ['Gaudy Hat', 'SetName.GAUDY'],
    ['A Beanie', 'SetName.GAUDY'],
    ['Gaudy Shirt', 'SetName.GAUDY'],
    ['Gaudy Pants', 'SetName.GAUDY'],
    ['Gaudy Boots', 'SetName.GAUDY'],
    ['Bloody Cleaver', 'SetName.GRB'],
    ['Chef\'s Hat', 'SetName.GRB'],
    ['Chef\'s Apron', 'SetName.GRB'],
    ['Regular Pants', 'SetName.GRB'],
    ['Non Slip Shoes', 'SetName.GRB'],
    ['Suspicious Sausage Necklace', 'SetName.GRB'],
    ['Raw Slab of Meat', 'SetName.GRB'],
    ['Magitech Blade', 'SetName.HSB'],
    ['Magitech Helmet', 'SetName.HSB'],
    ['Magitech Chestplate', 'SetName.HSB'],
    ['Magitech Leggings', 'SetName.HSB'],
    ['Magitech Boots', 'SetName.HSB'],
    ['Magitech Ring', 'SetName.HSB'],
    ['Magitech Amulet', 'SetName.HSB'],
    ['The Pen-Is', 'SetName.JAKE'],
    ['Office Hat', 'SetName.JAKE'],
    ['Office Shirt', 'SetName.JAKE'],
    ['Office Pants', 'SetName.JAKE'],
    ['Office Shoes', 'SetName.JAKE'],
    ['Stapler', 'SetName.JAKE'],
    ['A Regular Tie', 'SetName.JAKE'],
    ['Generic Paperweight', 'SetName.JAKE'],
    ['Beam Laser Sword', 'SetName.MEGA'],
    ['Mega Helmet', 'SetName.MEGA'],
    ['Mega Chest', 'SetName.MEGA'],
    ['Mega Blue Jeans', 'SetName.MEGA'],
    ['Mega Boots', 'SetName.MEGA'],
    ['Rusty Sword', 'SetName.SEWERS'],
    ['Crappy Helmet', 'SetName.SEWERS'],
    ['Crappy Chestplate', 'SetName.SEWERS'],
    ['Crappy Leggings', 'SetName.SEWERS'],
    ['Crappy Boots', 'SetName.SEWERS'],
    ['Gross Ring', 'SetName.SEWERS'],
    ['Cracked Amulet', 'SetName.SEWERS'],
    ['The Fists of Flubber', 'SetName.SLIMY'],
    ['A Bald Egg', 'SetName.SLIMY'],
    ['A Shrunken Voodoo Doll', 'SetName.SLIMY2'],
    ['A Priceless Van-Gogh Painting', 'SetName.SLIMY3'],
    ['A Giant Apple', 'SetName.SLIMY3'],
    ['A Power Pill', 'SetName.SLIMY4'],
    ['A Small Gerbil', 'SetName.SLIMY4'],
    ['Slimy Helmet', 'SetName.SLIMY'],
    ['Slimy Chest', 'SetName.SLIMY'],
    ['Slimy Pants', 'SetName.SLIMY'],
    ['Slimy Boots', 'SetName.SLIMY'],
    ['Spooky Sword', 'SetName.SPOOPY'],
    ['Spoopy Helmet', 'SetName.SPOOPY'],
    ['Ghostly Chest', 'SetName.SPOOPY'],
    ['Pants of Horror', 'SetName.SPOOPY'],
    ['Spectral Boots', 'SetName.SPOOPY'],
    ['Cursed Ring', 'SetName.SPOOPY'],
    ['Amulet of Sunshine, Sparkles, and Gore', 'SetName.SPOOPY'],
    ['Dragon Wings', 'SetName.SPOOPY'],
    ['A Giant Bazooka', 'SetName.STEALTH'],
    ['Stealthy Hat', 'SetName.STEALTH'],
    ['Stealthy Chest', 'SetName.STEALTH'],
    ['The Stealthiest Armour', 'SetName.STEALTH'],
    ['No Pants', 'SetName.STEALTH'],
    ['High Heeled Boots', 'SetName.STEALTH'],
    ['A Stick', 'SetName.TRAINING'],
    ['Cloth Hat', 'SetName.TRAINING'],
    ['Cloth Shirt', 'SetName.TRAINING'],
    ['Cloth Leggings', 'SetName.TRAINING'],
    ['Cloth Boots', 'SetName.TRAINING'],
    ['Ring of Greed', 'SetName.UUG_RINGS'],
    ['UUG\'s \'Special\' Ring', 'SetName.UUG_RINGS'],
    ['Ring of Might', 'SetName.UUG_RINGS'],
    ['Ring of Utility', 'SetName.UUG_RINGS'],
    ['Ring of Way Too Much Energy', 'SetName.UUG_RINGS'],
    ['Ring of Way Too Much Magic', 'SetName.UUG_RINGS'],
    ['Wanderer\'s Cane', 'SetName.WANDERER'],
    ['The Candy Cane of Destiny', 'SetName.WANDERER'],
    ['Wanderer\'s Hat', 'SetName.WANDERER'],
    ['Wanderer\'s Chest', 'SetName.WANDERER'],
    ['Wanderer\'s Pants', 'SetName.WANDERER'],
    ['Wanderer\'s Boots', 'SetName.WANDERER'],
    ['Fanny Pack', 'SetName.WANDERER'],
    ['taH s\'rerednaW', 'SetName.WANDERER2'],
    ['tsehC s\'rerednaW', 'SetName.WANDERER2'],
    ['stnaP s\'rerednaW', 'SetName.WANDERER2'],
    ['stooB s\'rerednaW', 'SetName.WANDERER2'],
    ['Dorky Glasses', 'SetName.WANDERER2'],
    ['Forest Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended Forest Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended Ascended Forest Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended Ascended Ascended Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended x4 Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended x5 Pendant', 'SetName.FOREST_PENDANT'],
    ['Ascended x6 Pendant', 'SetName.FOREST_PENDANT'],
    ['Looty McLootFace', 'SetName.LOOTY'],
    ['Sir Looty McLootington III, Esquire', 'SetName.LOOTY'],
    ['King Looty', 'SetName.LOOTY'],
    ['Emperor Looty', 'SetName.LOOTY'],
    ['GALACTIC HERALD LOOTY', 'SetName.LOOTY'],
    ['4G\'s Merge and Boost Tutorial Cube', 'SetName.SEWERS'],
    ['Ring of Apathy', 'SetName.MISC'],
    ['Seal of the Exile', 'SetName.MISC'],
    ['The Lonely Flubber', 'SetName.MISC'],
    ['The Triple Flubber', 'SetName.MISC'],
    ['Edgy Chest', 'SetName.EDGY'],
    ['Edgy Helmet', 'SetName.EDGY'],
    ['BOTH Edgy Boots', 'SetName.EDGY'],
    ['Left Edgy Boot', 'SetName.EDGY'],
    ['Right Edgy Boot', 'SetName.EDGY'],
    ['Edgy Pants', 'SetName.EDGY'],
    ['Edgy Jaw Axe', 'SetName.EDGY'],
    ['A Cheap Plastic Amulet', 'SetName.EDGY'],
    ['Clown Hat', 'SetName.PINK'],
    ['Fabulous Super Chest', 'SetName.PINK'],
    ['A Crappy Tutu', 'SetName.PINK'],
    ['Pretty Pink Slippers', 'SetName.PINK'],
    ['Giant Sticky Foot', 'SetName.PINK'],
    ['A Pretty Pink Bow', 'SetName.PINK'],
    ['A Worn Out Fedora', 'SetName.NERD'],
    ['Sweat-Stained NGU Shirt', 'SetName.NERD'],
    ['Not Sweat-Stained Underpants', 'SetName.NERD'],
    ['Nerdy Shoes', 'SetName.NERD'],
    ['Superior Japanese Katana', 'SetName.NERD'],
    ['An Ordinary Calculator', 'SetName.NERD'],
    ['Anime Figurine', 'SetName.NERD'],
    ['The D8', 'SetName.NERD2'],
    ['The D20', 'SetName.NERD2'],
    ['Anime Bodypillow', 'SetName.NERD3'],
    ['Red Meeple Thingy', 'SetName.NERD3'],
    ['A Bag of Trash', 'SetName.NERD4'],
    ['Heart Shaped Panties', 'SetName.NERD4'],
    ['Numerical Head', 'SetName.META'],
    ['Numerical Chest', 'SetName.META'],
    ['Numerical Legs', 'SetName.META'],
    ['Numerical Boots', 'SetName.META'],
    ['The Number 7', 'SetName.META'],
    ['69 Charm', 'SetName.META'],
    ['Infinity Charm', 'SetName.META'],
    ['Party Hat', 'SetName.PARTY'],
    ['Pogmail Chest', 'SetName.PARTY'],
    ['Tear Away Pants', 'SetName.PARTY'],
    ['Pizza Boots', 'SetName.PARTY'],
    ['The God of Thunder\'s Hammer', 'SetName.PARTY'],
    ['Plastic Red Cup', 'SetName.PARTY'],
    ['Party Whistle', 'SetName.PARTY'],
    ['Mobster Hat', 'SetName.MOBSTER'],
    ['Mobster Vest', 'SetName.MOBSTER'],
    ['Mobster Pants', 'SetName.MOBSTER'],
    ['Cement Boots', 'SetName.MOBSTER'],
    ['Tommy Gun', 'SetName.MOBSTER'],
    ['A Garrote', 'SetName.MOBSTER'],
    ['Brass Knuckles', 'SetName.MOBSTER'],
    ['Molotov Cocktail', 'SetName.MOBSTER2'],
    ['Violin Case', 'SetName.MOBSTER2'],
    ['The Godmother\'s Ring', 'SetName.MOBSTER3'],
    ['The Godmother\'s Wand', 'SetName.MOBSTER3'],
    ['Left Fairy Wing', 'SetName.MOBSTER4'],
    ['Right Fairy Wing', 'SetName.MOBSTER4'],
    ['Hamlet', 'SetName.TYPO'],
    ['Chess Plate', 'SetName.TYPO'],
    ['Logs', 'SetName.TYPO'],
    ['Booms', 'SetName.TYPO'],
    ['Wee pin', 'SetName.TYPO'],
    ['The Ass-cessory', 'SetName.TYPO'],
    ['Eye of ELXU', 'SetName.TYPO'],
    ['Spinning Tophat', 'SetName.FAD'],
    ['Demonic Flurbie Chestplate', 'SetName.FAD'],
    ['AAA Battery Legs', 'SetName.FAD'],
    ['Slinky Boots', 'SetName.FAD'],
    ['THE MALF SLAMMER', 'SetName.FAD'],
    ['Rare Foil Pokeyman Card', 'SetName.FAD'],
    ['A handful of Krazy Bonez', 'SetName.FAD'],
    ['Buster Sword Top', 'SetName.JRPG'],
    ['Buster Sword Upper', 'SetName.JRPG'],
    ['Buster Sword Lower', 'SetName.JRPG'],
    ['Buster Sword Bottom', 'SetName.JRPG'],
    ['Gift Shop Buster Sword Replica', 'SetName.JRPG'],
    ['A Gigantic Zipper', 'SetName.JRPG'],
    ['Anime Hero Wig', 'SetName.JRPG'],
    ['Hat of Greed', 'SetName.EXILE'],
    ['Blue Eyes Ultimate Chestplate', 'SetName.EXILE'],
    ['Blue Eyes White Chestplate', 'SetName.EXILE'],
    ['Trap Pants', 'SetName.EXILE'],
    ['All the other Titans\' Missing Shoes', 'SetName.EXILE'],
    ['The Disk of Dueling', 'SetName.EXILE'],
    ['The Joker', 'SetName.EXILE'],
    ['Antlers of the Exile', 'SetName.EXILE'],
    ['The Credit Card', 'SetName.EXILE2'],
    ['Tentacle of the Exile', 'SetName.EXILE2'],
    ['The Skip Card', 'SetName.EXILE3'],
    ['Antennae of the Exile', 'SetName.EXILE3'],
    ['The Black Lotus', 'SetName.EXILE4'],
    ['Buster of the Exile', 'SetName.EXILE4'],
    ['Cool Shades', 'SetName.RADLANDS'],
    ['Leather Jacket', 'SetName.RADLANDS'],
    ['Flamin\' Hot Shorts', 'SetName.RADLANDS'],
    ['A Skateboard', 'SetName.RADLANDS'],
    ['Nunchuks', 'SetName.RADLANDS'],
    ['Not Drugs', 'SetName.RADLANDS'],
    ['The Glove of Power', 'SetName.RADLANDS'],
    ['Dunce Cap', 'SetName.BACKTOSCHOOL'],
    ['School Jersey', 'SetName.BACKTOSCHOOL'],
    ['ULTRAWIDE Pants', 'SetName.BACKTOSCHOOL'],
    ['Shoes With Wheels', 'SetName.BACKTOSCHOOL'],
    ['Floppy Elastic Ruler', 'SetName.BACKTOSCHOOL'],
    ['THE S', 'SetName.BACKTOSCHOOL'],
    ['A Walkman', 'SetName.BACKTOSCHOOL'],
    ['A 10 Litre Hat', 'SetName.WESTWORLD'],
    ['Asslest Vest', 'SetName.WESTWORLD'],
    ['Assful Chaps', 'SetName.WESTWORLD'],
    ['Extra Spiky Spurs', 'SetName.WESTWORLD'],
    ['The Six Shooter', 'SetName.WESTWORLD'],
    ['A Battle Corgi', 'SetName.WESTWORLD'],
    ['A Pink Bandana', 'SetName.WESTWORLD'],
    ['A 9mm Beretta', 'SetName.WESTWORLD'],
    ['Space Helmet', 'SetName.ITHUNGERS'],
    ['Space Suit Chest', 'SetName.ITHUNGERS'],
    ['Space Suit Legs', 'SetName.ITHUNGERS'],
    ['Space Boots', 'SetName.ITHUNGERS'],
    ['Space Gun!', 'SetName.ITHUNGERS'],
    ['A Manhole', 'SetName.ITHUNGERS'],
    ['A Red Shirt', 'SetName.ITHUNGERS'],
    ['\'The Cricket\'', 'SetName.ITHUNGERS'],
    ['Evil Rubber Ducky', 'SetName.ITHUNGERS2'],
    ['A Gas Giant', 'SetName.ITHUNGERS2'],
    ['An Inanimate Carbon Rod', 'SetName.ITHUNGERS3'],
    ['A Funky Klein Bottle', 'SetName.ITHUNGERS3'],
    ['Giant Alien Bug Nest', 'SetName.ITHUNGERS4'],
    ['The Key', 'SetName.ITHUNGERS4'],
    ['Ascended x7 Pendant', 'SetName.FOREST_PENDANT'],
    ['SUPREME INTELLIGENCE LOOTY', 'SetName.LOOTY'],
    ['My Rainbow Heart', 'SetName.HEART'],
    ['Bread Bowl Helmet', 'SetName.BREADVERSE'],
    ['Paper Thin Crepe Cape', 'SetName.BREADVERSE'],
    ['Flour Sack Pants', 'SetName.BREADVERSE'],
    ['Gingerbread Boots', 'SetName.BREADVERSE'],
    ['1 Day-Old Baguette', 'SetName.BREADVERSE'],
    ['A Cream Pie', 'SetName.BREADVERSE'],
    ['A Spoonful of Yeast', 'SetName.BREADVERSE'],
    ['A Rolling Pin', 'SetName.BREADVERSE'],
    ['Disco Ball Helmet', 'SetName.SEVENTIES'],
    ['Disco Shirt', 'SetName.SEVENTIES'],
    ['Bell Bottoms', 'SetName.SEVENTIES'],
    ['Roller Skates', 'SetName.SEVENTIES'],
    ['A Rusty Old Sabre', 'SetName.SEVENTIES'],
    ['A Bit of White Powder', 'SetName.SEVENTIES'],
    ['Some Rolling Paper', 'SetName.SEVENTIES'],
    ['A Vinyl Record Shard', 'SetName.SEVENTIES'],
    ['Neck Bolts', 'SetName.HALLOWEEN'],
    ['Skeleton Shirt', 'SetName.HALLOWEEN'],
    ['A Broomstick', 'SetName.HALLOWEEN'],
    ['Fuzzy Boots', 'SetName.HALLOWEEN'],
    ['An Ordinary Apple', 'SetName.HALLOWEEN'],
    ['A Roll of Toilet Paper', 'SetName.HALLOWEEN'],
    ['Pandora\'s Box', 'SetName.HALLOWEEN'],
    ['A Giant Scythe', 'SetName.HALLOWEEN'],
    ['A Bandana', 'SetName.ROCKLOBSTER'],
    ['Broken Drum', 'SetName.ROCKLOBSTER'],
    ['Stonehenge Pants', 'SetName.ROCKLOBSTER'],
    ['Platform Boots', 'SetName.ROCKLOBSTER'],
    ['A Rocket', 'SetName.ROCKLOBSTER'],
    ['A Pet Rock', 'SetName.ROCKLOBSTER'],
    ['A Rolling Stone', 'SetName.ROCKLOBSTER'],
    ['Giant Drumsticks', 'SetName.ROCKLOBSTER'],
    ['A Skipping Stone', 'SetName.ROCKLOBSTER2'],
    ['A Bed Rock', 'SetName.ROCKLOBSTER2'],
    ['Rock Candy', 'SetName.ROCKLOBSTER3'],
    ['A Broken Pair Of Scissors', 'SetName.ROCKLOBSTER3'],
    ['Portable Stairway (To Heaven)', 'SetName.ROCKLOBSTER4'],
    ['Amplifier', 'SetName.ROCKLOBSTER4'],
    ['Ascended x8 Pendant', 'SetName.FOREST_PENDANT'],
    [431, 'SetName.LOOTY'],
    [432, 'SetName.FOREST'],
    [433, 'SetName.CAVE'],
    [434, 'SetName.SKY'],
    [435, 'SetName.HSB'],
    [436, 'SetName.CLOCK'],
    [437, 'SetName.TWO_D'],
    [438, 'SetName.SPOOPY'],
    [439, 'SetName.GAUDY'],
    [440, 'SetName.MEGA'],
    [441, 'SetName.BEARDVERSE'],
    [442, 'SetName.BADLY_DRAWN'],
    [443, 'SetName.STEALTH'],
    [444, 'SetName.CHOCO'],
    [445, 'SetName.EDGY'],
    [446, 'SetName.PINK'],
    [447, 'SetName.META'],
    [448, 'SetName.PARTY'],
    [449, 'SetName.TYPO'],
    [450, 'SetName.FAD'],
    [451, 'SetName.JRPG'],
    [452, 'SetName.RADLANDS'],
    [range(453, 460 + 1), 'SetName.CONSTRUCTION'],
    [range(461, 468 + 1), 'SetName.NETHER'],
    [range(469, 476 + 1), 'SetName.AMALGAMATE'],
    [477, 'SetName.AMALGAMATE2'],
    [478, 'SetName.AMALGAMATE3'],
    [479, 'SetName.AMALGAMATE4'],
    [range(496, 503 + 1), 'SetName.DUCK'],
    [504, 'SetName.FOREST_PENDANT'],
    [505, 'SetName.LOOTY'],
    [range(506, 514 + 1), 'SetName.PIRATE'],
]


def name2zone(name, id):
    for idx in range(len(ZONES)):
        try:
            if name == ZONES[idx][0] or int(id) == ZONES[idx][0] or int(id) in ZONES[idx][0]:
                return ZONES[idx][1]
        except TypeError:
                continue
    return 'incorrect zone'


def props2item(props):
    specs = []
    caps = []
    for id, val in props:
        if id == 'id':
            itemID = val
        if id == 'itemName':
            name = val
        if id == 'itemDesc':
            desc = val
        if id == 'type':
            slot = part2slot(val)
        if id == 'capAttack':
            specs += [['POWER', 'POWER', 1]]
            caps += [f2i(val)]
        if id == 'capDefense':
            specs += [['TOUGHNESS', 'TOUGHNESS', 1]]
            caps += [f2i(val)]
        if id[:8] == 'specType':
            specs += [spec2stat(val)]
        if id[:7] == 'capSpec':
            cap = f2i(val) / specs[-1][2]
            cap = int(cap) if int(cap) == cap else cap
            caps += [cap]
    if slot == 'MISC':
        tier = 'MISC'
    else:
        tier = name2zone(name, itemID)
    if slot == 'MISC':
        return
    name = name.replace('\'', '\\\'')
    # merge identical specs
    merged = {}
    for spec in specs:
        stat = spec[1]
        done = False
        for t in ['CAP', 'BARS', 'POWER']:
            if stat == 'ALL_' + t:
                merged['ENERGY_' + t] = 0
                merged['MAGIC_' + t] = 0
                done = True
        if done:
            continue
        merged[stat] = 0
    for idx in range(len(specs)):
        stat = specs[idx][1]
        done = False
        for t in ['CAP', 'BARS', 'POWER']:
            if stat == 'ALL_' + t:
                merged['ENERGY_' + t] += caps[idx]
                merged['MAGIC_' + t] += caps[idx]
                done = True
        if done:
            continue
        merged[stat] += caps[idx]
    print(f'    new Item({itemID}, \'{name}\', Slot.{slot}, {tier}, 100, [')
    for stat in merged:
        cap = merged[stat]
        if stat == 'specType.None' or stat == 'specType.Cooking' or cap == 0 or stat[:4] == 'ALL_':
            continue
        print(f'        [Stat.{stat}, {cap}],')
    print('    ]),')


def prefix():
    print('import {EmptySlot, Item, Stat, Slot, SetName} from \'./ItemAux\'')
    print('export const ITEMLIST = [')
    print('    new EmptySlot(Slot.WEAPON),')
    print('    new EmptySlot(Slot.HEAD),')
    print('    new EmptySlot(Slot.CHEST),')
    print('    new EmptySlot(Slot.PANTS),')
    print('    new EmptySlot(Slot.BOOTS),')
    print('    new EmptySlot(Slot.ACCESSORY),')
    print('    new EmptySlot(Slot.OTHER),')


def suffix():
    print('];')
    print('')
    print('')
    print(
        'export const LOOTIES = ITEMLIST.filter(x => x.zone !== undefined && x.zone[0] === SetName.LOOTY[0]).sort((a, b) => a.power - b.power).map(x=>x.name);')
    print(
        'export const PENDANTS = ITEMLIST.filter(x => x.zone !== undefined && x.zone[0] === SetName.FOREST_PENDANT[0]).sort((a, b) => a.power - b.power).map(x=>x.name);')


# get data
with open('ItemNameDesc.cs', 'r') as file:
    text = file.read()
    text = text.replace('\t', '')
    text = text.split('\n')

    items = []
    tmp = []
    line = 0
    while line < len(text):
        if text[line][:8] == 'itemName' or text[line] == '}':
            if tmp[0][:8] == 'itemName':
                items += [tmp]
            tmp = []
        tmp += [text[line]]
        line += 1
    items = items[1:]

# extract item properties
prefix()
for idx in range(len(items)):
    item = items[idx]
    props = []
    for jdx in range(len(item)):
        entry = item[jdx]
        pos1 = entry.index('[')
        if jdx == 0:
            pos2 = entry.index(']')
            itemID = entry[pos1+1:pos2]
            props += [['id', itemID]]
        pos3 = entry.index('=')
        props += [[entry[0:pos1], entry[pos3 + 1:-1].replace('"', '').strip()]]
    props2item(props)
suffix()
