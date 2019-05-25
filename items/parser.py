"""Parse TS file."""
import urllib.parse

import wget


def split_entities(lines):
    entities = []
    current = None
    curly = 0
    for line in lines:
        if current is None:
            if '{' in line:
                current = ''
            else:
                continue
        current += line + '\n'
        curly += line.count('{')
        curly -= line.count('}')
        if curly == 0:
            entities.append(current)
            current = None
    return entities


def parse_single(line, id):
    """Parse single id."""
    start = line.find(id) + len(id)
    end = line[start:].find(',')
    return line[start:start + end]


def print_item(item, setname):
    """Print single item."""
    print(f"""    new Item('{item['name']}', Slot.{item['slot']}, SetName.{setname}, 100, [""")
    for key, val in item['stats']:
        print(f"""        [Stat.{key}, {val}],""")
    print('    ]),')


def parse_entity(entity, download=False):
    """Parse entity."""
    sets = []
    setname = None
    set = []
    current = {'stats': []}
    for line in entity:
        sn_id = 'setName: SetName.'
        if sn_id in line:
            if setname is not None:
                set += [current]
                sets += [(setname, set)]
                set = []
                current = {'stats': []}
            setname = parse_single(line, sn_id)
            continue
        if setname is None:
            continue
        n_id = 'name: '
        if n_id in line:
            if 'name' in current:
                set += [current]
            name = parse_single(line, n_id).replace('!', '')
            current = {'stats': []}
            current['name'] = name[1:-1]
        slot_id = 'slot: Slot.'
        if slot_id in line:
            slot_name = parse_single(line, slot_id)
            current['slot'] = slot_name
        s_id = 'stat: Stat.'
        if s_id in line:
            stat_name = parse_single(line, s_id)
            stat_val = parse_single(line, ', value: ')[:-1]
            current['stats'] += [(stat_name, stat_val)]
        if download:
            with open('failed.txt', 'a+') as failed:
                img_id = 'img: '
                if img_id in line:
                    url = parse_single(line, img_id)[1:-1]
                    url = urllib.parse.unquote(url)
                    try:
                        wget.download(url, 'img/' + current['name'].replace('\\', '') + '.png')
                    except:
                        failed.write(url + '\n')
    sets += [(setname, set)]
    print("import {Item, Stat, Slot, SetName} from './ItemAux'")
    print('export const ITEMLIST = [')
    for setname, set in sets:
        for item in set:
            print_item(item, setname)
    print('];')


with open('items.ts') as file:
    parse_entity(file, 0)
