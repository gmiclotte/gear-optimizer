import binascii
import struct


def getString(h, idx, hack=False):
    string = b''
    while idx < len(h):
        if h[idx] == b'\x00':
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
    print(idx)
    # long maxLevel;
    maxLevel = h[idx]
    maxLevel = binascii.hexlify(maxLevel)
    maxLevel = int(maxLevel, 16)
    print(maxLevel)

    # string wishName
    idx += 12
    h, idx, wishName = getString(h, idx)
    if h[idx + 4] != b'\x00':
        wishName = wishName[:-1]
        idx -= 1
    wishName = wishName.decode('ascii')
    print(wishName)

    # string WishDesc
    while h[idx] == b'\x00':
        idx += 1
    while h[idx] != b'\x00':
        idx += 1
    while h[idx] == b'\x00':
        idx += 1
    h, idx, wishDesc = getString(h, idx)
    wishDesc = wishDesc.decode('ascii')
    print(wishDesc)

    # float wishSpeedDivider
    while h[idx] == b'\x00':
        idx += 1
    wishSpeedDivider = b''.join(h[idx:idx + 4])
    wishSpeedDivider = struct.unpack('<f', wishSpeedDivider)[0]
    print(f'{wishSpeedDivider:.1E}')
    idx += 4

    # skip last properties
    return idx + 20, maxLevel
    # float effectPerLevel

    # difficulty difficultyRequirement

    # Sprite wishSprite


def getHackProperties(h, idx):
    # float baseDivider;
    baseDivider = b''.join(h[idx:idx + 4])
    baseDivider = struct.unpack('<f', baseDivider)[0]
    print(f'{baseDivider:.1E}')
    idx += 8

    # string hackName;
    h, idx, hackName = getString(h, idx)
    if h[idx + 4] != b'\x00':
        hackName = hackName[:-1]
        idx -= 1
    hackName = hackName.decode('ascii')
    print(hackName)

    # string hackDesc;
    while h[idx] == b'\x00':
        idx += 1
    while h[idx] != b'\x00':
        idx += 1
    while h[idx] == b'\x00':
        idx += 1
    h, idx, hackDesc = getString(h, idx, hack=True)
    # if h[idx + 4] != b'\x00':
    #    hackDesc = hackDesc[:-1]
    #    idx -= 1
    hackDesc = hackDesc.decode('ascii')
    print(hackDesc)

    # float baseEffectPerLevel;
    while h[idx] == b'\x00':
        idx += 1
    baseEffectPerLevel = b''.join(h[idx:idx + 4])
    baseEffectPerLevel = struct.unpack('<f', baseEffectPerLevel)[0]
    print(f'{baseEffectPerLevel:.2f}')
    idx += 4

    # float milestoneEffect;
    milestoneEffect = b''.join(h[idx:idx + 4])
    milestoneEffect = struct.unpack('<f', milestoneEffect)[0]
    print(f'{milestoneEffect:.2f}')
    idx += 4

    # long milestoneThreshold;
    milestoneThreshold = b''.join(h[idx:idx + 8])
    milestoneThreshold = struct.unpack('<q', milestoneThreshold)[0]
    print(f'{milestoneThreshold:d}')
    idx += 8

    return idx


# get data
file = open('level0', 'rb')
bytes = file.read()
h = [bytes[idx:idx + 1] for idx in range(len(bytes))]

# get wishes
idx = 2982320 - 12
l = 0
count = 79
for _ in range(count):
    print(f'Wish {_}')
    idx, ml = getWishProperties(h, idx)
    l += ml
    print()

print(f'Total number of wish levels: {l}.')

# get hacks
idx = 4096472 - 8
count = 15
for _ in range(count):
    print(f'Hack {_}')
    idx = getHackProperties(h, idx)
    print()
