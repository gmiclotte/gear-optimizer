import binascii
import struct
import numpy as np

verbose = 1

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
    printv(idx)
    # long maxLevel;
    maxLevel = h[idx]
    maxLevel = binascii.hexlify(maxLevel)
    maxLevel = int(maxLevel, 16)
    printv(maxLevel)

    # string wishName
    idx += 12
    preidx = idx
    h, idx, wishName = getString(h, idx)
    #if h[idx + 4] != b'\x00':
        #wishName = wishName[:-1]
        #idx -= 1
    wishName = wishName.decode('ascii')
    if  wishName[-2] in 'I' and not wishName[-1] in 'IV':
        wishName = wishName[:-1]
        idx -= 1
    if wishName[-1] in 'c' and wishName[-2] in 'V':
        wishName = wishName[:-1]
        idx -= 1
    if  wishName[-1] in '@Z?B':
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
    print(preidx, idx)
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


# get data
file = open('level0', 'rb')
byte_data = file.read()
h = [byte_data[idx:idx + 1] for idx in range(len(byte_data))]

# get wishes
idx = 3004960 - 12
l = 0
count = 110
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
idx = 4134104 - 8
count = 15
hacks = []
for _ in range(count):
    printv(f'Hack {_}')
    idx, hack = getHackProperties(h, idx)
    hacks += [hack]
    printv()

for wish in wishes:
    wishName, wishSpeedDivider, maxLevel = wish
    print(f'[\'{wishName}\', {wishSpeedDivider:.2E}, {maxLevel:d}],')
print()
for hack in hacks:
    hackName, baseDivider, baseEffectPerLevel, milestoneEffect, milestoneThreshold, maxLevel = hack
    print(f'[\'{hackName}\', {baseDivider:.2E}, {100 * baseEffectPerLevel:.4f}, {milestoneEffect:.4f}, {milestoneThreshold:d}, {maxLevel:d}],')
    
    
    
