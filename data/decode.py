import binascii
import struct
import sys

import numpy as np

verbose = 0


def printv(*args):
    if verbose:
        print(*args)


def getString(h, idx, hack=False):
    string = b''
    while idx < len(h):
        if h[idx] in [b'\x00', b'\x1C', b'\x16']:
            break
        val = int.from_bytes(h[idx], 'little')
        if val == 206 and int.from_bytes(h[idx + 1], 'little') == 177:
            # alpha
            string += b'A'
            idx += 2
            continue
        if 0 >= val or val >= 128:
            break
        string += h[idx]
        idx += 1
        if hack and val == 34 and len(string) > 1:
            break
    return h, idx, string


def getWishProperties(h, idx):
    # long maxLevel;
    maxLevel = h[idx]
    maxLevel = binascii.hexlify(maxLevel)
    maxLevel = int(maxLevel, 16)
    printv(maxLevel)

    # string wishName
    idx += 12
    preidx = idx
    h, idx, wishName = getString(h, idx)
    # if h[idx + 4] != b'\x00':
    # wishName = wishName[:-1]
    # idx -= 1
    wishName = wishName.decode('ascii')
    if wishName[-2] in 'I' and not wishName[-1] in 'IV':
        wishName = wishName[:-1]
        idx -= 1
    if wishName[-1] in 'c' and wishName[-2] in 'V':
        wishName = wishName[:-1]
        idx -= 1
    if wishName[-1] in '@Z?B':
        wishName = wishName[:-1]
        idx -= 1
    if wishName[-2] in '?!':
        wishName = wishName[:-1]
        idx -= 1
    printv(wishName)
    while (idx - preidx) % 4 != 0:
        idx += 1
    idx += 4

    # string WishDesc
    preidx = idx
    h, idx, wishDesc = getString(h, idx)
    wishDesc = wishDesc.decode('ascii')
    if wishDesc[-2] in '?!P':
        wishDesc = wishDesc[:-1]
        idx -= 1
    if wishDesc[-2] in 'Q':
        wishDesc = wishDesc[:-2]
        idx -= 2
    if wishDesc[-2] in '^':
        wishDesc = wishDesc[:-4]
        idx -= 4
    if wishDesc[-1] == 28:
        wishDesc = wishDesc[:-1]
        idx -= 1
    printv(wishDesc)
    while (idx - preidx) % 4 != 0:
        idx += 1

    # float wishSpeedDivider
    wishSpeedDivider = b''.join(h[idx:idx + 4])
    wishSpeedDivider = struct.unpack('<f', wishSpeedDivider)[0]
    printv(f'{wishSpeedDivider:.1E}')
    idx += 4

    # skip last properties
    return idx + 20, maxLevel, [wishName, wishSpeedDivider, maxLevel]
    # float effectPerLevel

    # difficulty difficultyRequirement

    # Sprite wishSprite


def getHackProperties(h, idx):
    # float baseDivider;
    baseDivider = b''.join(h[idx:idx + 4])
    baseDivider = struct.unpack('<f', baseDivider)[0]
    printv('yes', f'{baseDivider:.1E}')
    idx += 8

    # string hackName;
    preidx = idx
    h, idx, hackName = getString(h, idx)
    if h[idx + 4] != b'\x00':
        hackName = hackName[:-1]
        idx -= 1
    hackName = hackName.decode('ascii')
    printv(hackName)
    while (idx - preidx) % 4 != 0:
        idx += 1
    idx += 4

    # string hackDesc;
    preidx = idx
    h, idx, hackDesc = getString(h, idx, hack=True)
    hackDesc = hackDesc.decode('ascii')
    printv(hackDesc)
    while (idx - preidx) % 4 != 0:
        idx += 1

    # float baseEffectPerLevel;
    baseEffectPerLevel = b''.join(h[idx:idx + 4])
    baseEffectPerLevel = struct.unpack('<f', baseEffectPerLevel)[0]
    printv(f'{100 * baseEffectPerLevel:.4f}')
    idx += 4

    # float milestoneEffect;
    milestoneEffect = b''.join(h[idx:idx + 4])
    milestoneEffect = struct.unpack('<f', milestoneEffect)[0]
    printv(f'{milestoneEffect:.4f}')
    idx += 4

    # long milestoneThreshold;
    milestoneThreshold = b''.join(h[idx:idx + 8])
    milestoneThreshold = struct.unpack('<q', milestoneThreshold)[0]
    printv(f'{milestoneThreshold:d}')
    idx += 8

    # max level
    upperbound = np.log(1e38 / baseDivider) / np.log(1.0078)
    maxLevel = int(np.log(1e38 / baseDivider / upperbound) / np.log(1.0078))
    printv(f'{maxLevel:d}')

    return idx, [hackName, baseDivider, baseEffectPerLevel, milestoneEffect, milestoneThreshold, maxLevel]


def getNGUProperties(h, idx):
    counts = [9, 7, 9, 7, 9, 7]
    nguDividers = []
    for count in counts:
        for i in range(count):
            # float NGUDivider;
            nguDivider = b''.join(h[idx:idx + 4])
            nguDivider = struct.unpack('<f', nguDivider)[0]
            printv(f'{nguDivider:.1E}')
            nguDividers += [nguDivider]
            idx += 4
        idx += 4
    boostFactors = []
    for count in counts:
        for i in range(count):
            # float boostFactor;
            boostFactor = b''.join(h[idx:idx + 4])
            boostFactor = struct.unpack('<f', boostFactor)[0]
            printv(f'{boostFactor:.1E}')
            boostFactors += [boostFactor]
            idx += 4
        idx += 4
    energy_names = ['Augments', 'Wandoos', 'Respawn', 'Gold',
                    'Adventure α', 'Power α', 'Drop Chance', 'Magic NGU', 'PP']
    magic_names = ['Yggdrasil', 'Exp', 'Power β', 'Number',
                   'Time Machine', 'Energy NGU', 'Adventure β']
    energy_softcap = [
        1e9, 1e9, 4e2, 1e9, 1e3, 1e9, 1e3, 1e3, 1e3,
        1e9, 1e3, 1e4, 1e9, 1e3, 1e9, 1e3, 1e3, 1e3,
        1e9, 1e3, 1e4, 1e3, 1e3, 1e9, 1e3, 1e3, 1e3,
    ]
    magic_softcap = [
        4e2, 2e3, 1e9, 1e3, 1e3, 1e3, 1e3,
        4e2, 2e3, 1e9, 1e3, 1e3, 1e3, 1e3,
        4e2, 2e3, 1e9, 1e3, 1e3, 1e3, 1e3,
    ]
    energy_sc_bonus = [
        0, 0, 5, 0, 31.7, 0, 31.7, 125.9, 125.9,
        0, 177.9, 20, 0, 177.9, 0, 125.9, 125.9, 251.2,
        0, 354.81, 20, 31.63, 251.19, 0, 251.2, 501.19, 501.21,
    ]
    magic_sc_bonus = [
        55.4, 95.66, 0, 31.7, 3.981, 125.9, 63.13,
        219.72, 437.35, 0, 125.9, 3.981, 251.2, 177.83,
        247.69, 639.56, 0, 251.2, 3.981, 354.82, 436.53,
    ]
    energy_sc_exponent = [
        0, 0, 0.2, 0, 0.5, 0, 0.5, 0.3, 0.3,
        0, 0.25, 0.05, 0, 0.25, 0, 0.3, 0.3, 0.2,
        0, 0.15, 0.05, 0.5, 0.2, 0, 0.2, 0.1, 0.1,
    ]
    magic_sc_exponent = [
        0.33, 0.4, 0, 0.5, 0.8, 0.3, 0.4,
        0.1, 0.2, 0, 0.3, 0.8, 0.2, 0.25,
        0.08, 0.15, 0, 0.2, 0.8, 0.15, 0.12,
    ]
    energy = []
    for i in range(len(energy_names)):
        d = [nguDividers[i], nguDividers[i + 16],  nguDividers[i + 32]]
        f = [boostFactors[i], boostFactors[i + 16], boostFactors[i + 32]]
        energy += [[energy_names[i],
                    d[0], f[0], energy_softcap[i], energy_sc_bonus[i], energy_sc_exponent[i],
                    d[1], f[1], energy_softcap[i + 9], energy_sc_bonus[i + 9], energy_sc_exponent[i + 9],
                    d[2], f[2], energy_softcap[i + 18], energy_sc_bonus[i + 18], energy_sc_exponent[i + 18]
                    ]]
    magic = []
    for i in range(len(magic_names)):
        j = i + 9
        d = [nguDividers[j], nguDividers[j + 16],  nguDividers[j + 32]]
        f = [boostFactors[j], boostFactors[j + 16], boostFactors[j + 32]]
        magic += [[magic_names[i],
                   d[0], f[0], magic_softcap[i], magic_sc_bonus[i], magic_sc_exponent[i],
                   d[1], f[1], magic_softcap[i + 7], magic_sc_bonus[i + 7], magic_sc_exponent[i + 7],
                   d[2], f[2], magic_softcap[i + 14], magic_sc_bonus[i + 14], magic_sc_exponent[i + 14]
                   ]]
    return energy, magic


# get data
file = open('level0', 'rb')
byte_data = file.read()
h = [byte_data[idx:idx + 1] for idx in range(len(byte_data))]

# get wishes
idx = int(sys.argv[2]) - 12
l = 0
count = 230 + 1
wishes = []
for _ in range(count):
    printv(f'Wish {_}')
    idx, ml, wish = getWishProperties(h, idx)
    l += ml
    wishes += [wish]
    printv()

printv(f'Total number of wish levels: {l}.')
printv()

# get hacks
idx = int(sys.argv[1]) - 8
count = 15
hacks = []
for _ in range(count):
    printv(f'Hack {_}')
    idx, hack = getHackProperties(h, idx)
    hacks += [hack]
    printv()

# get ngus
idx = int(sys.argv[3])
print(idx)
energy, magic = getNGUProperties(h, idx)

for wish in wishes:
    wishName, wishSpeedDivider, maxLevel = wish
    print(f'[\'{wishName}\', {wishSpeedDivider:.2E}, {maxLevel:d}],')
print()
for hack in hacks:
    hackName, baseDivider, baseEffectPerLevel, milestoneEffect, milestoneThreshold, maxLevel = hack
    print(f'[\'{hackName}\', {baseDivider:.2E}, {100 * baseEffectPerLevel:.4f}, {milestoneEffect:.4f}, {milestoneThreshold:d}, {maxLevel:d}],')
print('''export const NGUs = {
    energy: [''')
for ngu in energy:
    name, nc, nb, nsc, nscb, nsce, ec, eb, esc, escb, esce, sc, sb, ssc, sscb, ssce = ngu
    print(f'        ngu(\'{name}\', {nc:.2E}, {nb:.2E}, {nsc:.2E}, {nscb}, {nsce:.2E}, {ec:.2E}, {eb:.2E}, {esc:.2E}, {escb}, {esce:.2E}, {sc:.2E}, {sb:.2E}, {ssc:.2E}, {sscb}, {ssce:.2E}),')
print('''    ],
    magic: [''')
for ngu in magic:
    name, nc, nb, nsc, nscb, nsce, ec, eb, esc, escb, esce, sc, sb, ssc, sscb, ssce = ngu
    print(f'        ngu(\'{name}\', {nc:.2E}, {nb:.2E}, {nsc:.2E}, {nscb}, {nsce:.2E}, {ec:.2E}, {eb:.2E}, {esc:.2E}, {escb}, {esce:.2E}, {sc:.2E}, {sb:.2E}, {ssc:.2E}, {sscb}, {ssce:.2E}),')
print('''    ]
};)''')
