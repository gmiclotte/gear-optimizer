// Heavily inspired by https://github.com/AxesOfEvil/NGU-save-parser
import {Buffer} from 'buffer'
import struct from 'python-struct'
import Long from 'long';

const DEFERRED = 'deferred'

const getJson = obj => {
    if (obj == null) return null
    if (typeof obj === 'number') return obj
    if (typeof obj === 'string') return obj
    if (typeof obj === 'object') {
        if (obj instanceof Long) {
            return obj
        }
        if (obj instanceof Array) {
            return obj.map(x => getJson(x))
        }
        if (obj.hasOwnProperty('value') && obj.value !== null && obj.value !== undefined) {
            if (obj.value.hasOwnProperty('_items') && obj.value._items !== undefined && obj.value._items.hasOwnProperty('value') && obj.value._items.value instanceof Array) {
                return obj.value._items.value.map(x => getJson(x))
            }
            return getJson(obj.value)
        } else {
            const res = {}
            for (const [key, value] of Object.entries(obj)) {
                res[key] = getJson(value)
            }
            return res
        }
    }
    throw new Error('type unsupported')
}


export class Deserializer {
    /**
     *
     * @param {Buffer} data
     * @param {number} pos
     */
    constructor(data, pos = 0) {
        this.data = data
        this.pos = pos
        this.idmap = {}
        this.meta = {}
        this.seen = new Set()
        this.printHex(10)
    }

    /**
     * @param {string} input
     */
    static fromFile(input) {
        try {
            const content = Buffer.from(input, 'base64')
            const offset = content.indexOf(Buffer.from('checksum')) + 34
            const data = Buffer.from(content.slice(offset).toString('binary'), 'base64')
            return new this(data, data.indexOf(Buffer.from('PlayerData')) - 6)
        } catch (error) {
            console.error('Could not parse file', error)
        }
    }

    get(name) {
        return Object.values(this.idmap).find(x => x.__cname__ === name)
    }

    getJson(name) {
        return getJson(this.get(name))
    }

    printHex(...args) {
        let start, end
        if (args.length === 1) {
            start = this.pos
            end = this.pos + args[0]
        } else [start, end] = args
        let newEnd
        while (start < end) {
            newEnd = Math.min(end, start + 16)
            const startString = start.toString(16).padStart(8, '0')
            const hexString = this.data.slice(start, newEnd).toString('hex').replace(/.{1,2}(?=(.{2})+$)/g, '$& ')
            const decodedString = Array.from(this.data.slice(start, newEnd)).map(x => (x > 31 && x < 127) ? String.fromCharCode(x) : '.').join('')
            const str = `${startString}        ${hexString}        ${decodedString}`
            console.debug(str)
            start += 16
        }
    }

    parse() {
        const ret = []

        let t = null
        while (true) {
            const _type = this.data[this.pos]
            try {
                if (_type === 1) ret.push(this.parseRefObj())
                else if (_type === 4 || _type === 5) ret.push(this.parseClass())
                else if (_type === 7) ret.push(this.parseGenericArray())
                else if (_type === 10) this.pos += 1
                else if (_type === 15) ret.push(this.parsePrimArr())
                else if (_type === 11) {
                    console.debug('Found end')
                    break
                } else {
                    console.error(`Stopping on type ${_type}, previous type was ${t}`)
                    console.error('position', this.pos)
                    break
                }
            } catch (error) {
                console.error(error)
                break
            }
            t = _type
        }
        this._finalize()
        return ret
    }

    parseRefObj() {
        if (this.data[this.pos] !== 1) throw new Error(`Unsupported data type: ${this.data[this.pos]}`)
        this.pos += 1
        const _id = this.readU32()
        const metaid = this.readU32()
        this.idmap[_id] = this.getClassValues(metaid)
        return this.idmap[_id]
    }

    readU32() {
        const res = struct.unpack('<L', this.data.slice(this.pos, this.pos + 4))
        this.pos += 4
        return res[0]
    }

    getClassValues(metaid) {
        if (!this.meta.hasOwnProperty(metaid)) throw new Error(`Couldn't find meta-id ${metaid}`)
        const cls = JSON.parse(JSON.stringify(this.meta[metaid]))
        const clsIdx = cls['__fields__']
        delete cls['__fields__']
        for (const name of clsIdx) {
            const _type = cls[name]['type']
            console.debug(`${name} -- ${_type}`)
            const [_id, value] = this.getSingleValue(_type, cls[name]['code'], name)
            if (value === DEFERRED) cls[name][DEFERRED] = _id
            else cls[name].value = value
        }
        return cls
    }

    getSingleValue(type_tag, type_spec, name) {
        if (type_tag === 0) return [null, this.getPrimValue(type_spec)]
        if (type_tag === 1) {
            if (this.data[this.pos] !== 6) {
                if (this.data[this.pos] === 9) {
                    return this.getSingleValue(3, null, name)
                }
                if (this.data[this.pos] === 10) {
                    return this.getSingleValue(3, null, name)
                }
                throw new Error(`Could not parse string for ${name}`)
            }
            this.pos += 1
            const _id = this.readU32()
            return [_id, this.readStr()]
        }
        if (type_tag === 3 || type_tag === 4 || type_tag === 7) {
            const elem = this.data[this.pos]
            if (elem === 1) return [null, this.parseRefObj()]
            if (elem === 4 || elem === 5) return [null, this.parseClass()]
            if (elem === 9) {
                this.pos += 1
                const _id = this.readU32()
                if (this.idmap.hasOwnProperty(_id)) console.debug(`Found object reference: ${this.idmap[_id]} for ${name}`)
                else console.debug(`Found deferred object reference    '${_id}' for ${name}`)
                return [_id, DEFERRED]
            }
            if (elem === 10) {
                this.pos += 1
                return [null, null]
            }
            if (elem === 13) {
                this.pos += 1
                const count = this.readByte()
                return [null, (new Array(count)).fill(null)]
            }
            if (elem === 14) {
                this.pos += 1
                const count = this.readU32()
                return [null, (new Array(count)).fill(null)]
            }
            throw new Error(`Unknown element type ${elem} for ${name}`)
        }
        throw new Error(`Couldn't handle type ${type_tag} for ${name}`)
    }

    getPrimValue(primType) {
        if (primType === 1) return this.readByte()
        if (primType === 6) return this.readDouble()
        if (primType === 8) return this.readI32()
        if (primType === 9) return this.readI64()
        if (primType === 11) return this.readFloat()
        throw new Error(`Could not handle prim type '${primType}'`)
    }

    readByte(peek = false) {
        const ret = this.data[this.pos]
        if (!peek) this.pos += 1
        return ret
    }

    readDouble() {
        const res = struct.unpack('<d', this.data.slice(this.pos, this.pos + 8))
        this.pos += 8
        return res[0]
    }

    readI32() {
        const res = struct.unpack('<l', this.data.slice(this.pos, this.pos + 4))
        this.pos += 4
        return res[0]
    }

    readI64() {
        const res = struct.unpack('<q', this.data.slice(this.pos, this.pos + 8))
        this.pos += 8
        return res[0]
    }

    readFloat() {
        const res = struct.unpack('<f', this.data.slice(this.pos, this.pos + 4))
        this.pos += 4
        return res[0]
    }

    readStr() {
        let size = 0
        let shift = 0
        while (true) {
            const _siz = this.data[this.pos]
            this.pos += 1
            size = size + ((0x7f & _siz) << shift)
            shift += 7
            if (_siz < 128) break
        }
        const ret = this.data.slice(this.pos, this.pos + size).toString('utf8')
        this.pos += size
        return ret
    }

    parseClass() {
        const orig_pos = this.pos
        const elem_type = this.readByte()

        if (elem_type !== 4 && elem_type !== 5) {
            throw new Error(`Unsupported data type: ${elem_type}`)
        }

        const _id = this.readU32()
        const cname = this.readStr()
        let count = this.readU32()
        console.debug(`${cname}(${_id}) @ ${orig_pos.toString(16).padStart(4, '0')} Count: ${count}`)
        const cls_idx = []
        const cls = {}
        while (count > 0) {
            const field = this.readStr()
            cls_idx.push(field)
            count -= 1
        }
        for (const name of cls_idx) {
            cls[name] = {type: this.readByte()}
        }

        for (const name of cls_idx) {
            const type_tag = cls[name]['type']
            cls[name]['code'] = this.getTypeSpec(type_tag)
        }

        this.printHex(30)
        cls['__cname__'] = cname
        cls['__fields__'] = cls_idx
        this.meta[_id] = cls
        if (elem_type === 5) /* const assemblyId = */ this.readU32() // only classes have assembly id
        this.printHex(orig_pos, this.pos)
        this.idmap[_id] = this.getClassValues(_id)
        return this.idmap[_id]
    }

    getTypeSpec(type_tag) {
        if (type_tag === 0) return this.readByte()
        if (type_tag === 1) return null
        if (type_tag === 3) return this.readStr()
        if (type_tag === 4) return [this.readStr(), this.readU32()]
        if (type_tag === 7) return this.readByte()
        throw new Error(`Can't handle type ${type_tag}`)
    }

    parseGenericArray() {
        if (this.data[this.pos] !== 7) throw new Error(`Unsupported data type: ${this.data[this.pos]}`)

        this.pos += 1
        const _id = this.readU32()
        const array_type = this.readByte()
        const dimensions = this.readU32()
        if (array_type !== 0 || dimensions !== 1) throw new Error('Multidimensional arrays not supported')
        const elems_per_dim = []
        for (let i = 0; i < dimensions; i++) {
            elems_per_dim.push(this.readU32())

        }
        const type_tag = this.readByte()
        const type_spec = this.getTypeSpec(type_tag)
        const ret = []
        while (ret.length < elems_per_dim[0]) {
            const res = this.getSingleValue(type_tag, type_spec, "unknown")
            if (res[1] instanceof Array) {
                ret.push(...res[1].map(_x => [res[0], _x]))
            } else {
                ret.push(res)
            }
        }
        this.idmap[_id] = ret
        return this.idmap[_id]
    }

    parsePrimArr() {
        if (this.data[this.pos] !== 15) throw new Error(`Unsupported data type: ${this.data[this.pos]}`)
        this.pos += 1
        const _id = this.readU32()
        let count = this.readU32()
        const _type = this.readByte()
        const ret = []
        while (count) {
            ret.push(this.getPrimValue(_type))
            count -= 1
        }
        this.idmap[_id] = ret
        return this.idmap[_id]
    }

    _finalize() {
        for (const _id in this.idmap) {
            this._fixDeferredId(_id)
        }
    }

    _fixDeferredId(_id) {
        if (!this.seen.has(_id)) {
            this.seen.add(_id)
            if (this.idmap[_id] instanceof Array) {
                for (const [_idx, _val] of Object.entries(this.idmap[_id])) {
                    if (_val instanceof Array && _val[_val.length - 1] === DEFERRED) {
                        this._fixDeferredId(_val[0])
                        this.idmap[_id][_idx] = this.idmap[_val[0]]
                    }
                }
            }
            this._fixDeferredDict(this.idmap[_id])
        }
    }

    _fixDeferredDict(item) {
        if (!(item instanceof Object) || item instanceof Array) return
        for (const [key, ref] of Object.entries(item)) {
            if (key.startsWith('__')) continue
            if (key === DEFERRED) continue
            if (key === 'value' && ref instanceof Array) {
                for (const [_idx, _val] of Object.entries(ref)) {
                    if (_val instanceof Array && _val[_val.length - 1] === DEFERRED) {
                        this._fixDeferredId(_val[0])
                        ref[_idx] = this.idmap[_val[0]]
                    }
                }
                continue
            }
            this._fixDeferredDict(ref)
        }
        if (DEFERRED in item) {
            this._fixDeferredDict(item[DEFERRED])
            item['value'] = this.idmap[item[DEFERRED]]
            delete item[DEFERRED]
        }
    }
}
