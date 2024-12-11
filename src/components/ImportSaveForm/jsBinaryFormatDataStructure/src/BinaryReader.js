import PrimitiveType from "./PrimitiveType";
import Decimal from './Decimal.js';
import {Buffer} from 'buffer';
import BigInt from "core-js/features/bigint";

const LOG_EVERY_READ = false;

class BinaryReader {
    constructor(buffer) {
        this._size = buffer.length;
        this._buffer = buffer;
        this._offset = 0;
    }

    _ensureBuffer(size) {
        this._offset = this._size - this._buffer.length;
        if (LOG_EVERY_READ) {
            console.log(size, this._offset, `0x${this._offset.toString(16)}`, this._buffer.slice(0, size));
        }
        if (size > this._buffer.length) {
            throw new Error('End of buffer');
        }
    }

    _getStackTrace(skips = 2) {
        const error = new Error();
        const stack = error.stack.split('\n').slice(1); // Remove the first line (error message)
        const compactStack = [];
        for (let idx = 0; idx < stack.length; idx++) {
            const line = stack[idx];
            const parts = line.trim().split(' ');
            const method = parts[1];
            const location = parts[2];
            const lineNumber = location.match(/:(\d+):\d+/)[1]; // Extract the line number
            if (method.includes('BinaryReader._getStackTrace') || idx < skips) {
                continue;
            }
            if (method.includes('NRBFReader.parse')) {
                break;
            }
            compactStack.push(`${method}@${lineNumber}`);
        }
        return compactStack.join(' -> ');
    }

    read(primitiveType) {
        switch (primitiveType) {
            case PrimitiveType.None:
                return this.readObject();
            case PrimitiveType.Boolean:
                return this.readBoolean();
            case PrimitiveType.Byte:
                return this.readByte();
            case PrimitiveType.Char:
                return this.readChar();
            case PrimitiveType.Decimal:
                return this.readString();
            case PrimitiveType.Double:
                return this.readDouble();
            case PrimitiveType.Int16:
                return this.readInt16();
            case PrimitiveType.Int32:
                return this.readInt32();
            case PrimitiveType.Int64:
                return this.readInt64();
            case PrimitiveType.SByte:
                return this.readSByte();
            case PrimitiveType.Single:
                return this.readSingle();
            case PrimitiveType.TimeSpan:
                return this.readTimeSpan();
            case PrimitiveType.DateTime:
                return this.readDateTime();
            case PrimitiveType.UInt16:
                return this.readUInt16();
            case PrimitiveType.UInt32:
                return this.readUInt32();
            case PrimitiveType.UInt64:
                return this.readUInt64();
            case PrimitiveType.Null:
                return null;
            case PrimitiveType.String:
                return this.readString();
            default:
                throw new Error(`Unsupported array type: ${primitiveType}`);
        }
    }

    readDateTime() {
        const value = this.readInt64();
        const ticks = value >> 2n; // Extract the first 62 bits
        const kind = Number(value & 0b11n); // Extract the last 2 bits
        if (LOG_EVERY_READ) {
            console.log("readDateTime", {ticks, kind}, this._getStackTrace());
        }
        return {ticks, kind};
    }

    readByte() {
        this._ensureBuffer(1);
        const value = this._buffer.readUInt8(0);
        this._buffer = this._buffer.slice(1);
        if (LOG_EVERY_READ) {
            console.log("readByte", value, this._getStackTrace());
        }
        return value;
    }

    readSByte() {
        this._ensureBuffer(1);
        const value = this._buffer.readInt8(0);
        this._buffer = this._buffer.slice(1);
        if (LOG_EVERY_READ) {
            console.log("readSByte", value, this._getStackTrace());
        }
        return value;
    }

    readBoolean() {
        const value = this.readByte() !== 0;
        if (LOG_EVERY_READ) {
            console.log("readBoolean", value, this._getStackTrace());
        }
        return value;
    }

    readInt16() {
        this._ensureBuffer(2);
        const value = this._buffer.readInt16LE(0);
        this._buffer = this._buffer.slice(2);
        if (LOG_EVERY_READ) {
            console.log("readInt16", value, this._getStackTrace());
        }
        return value;
    }

    readInt32() {
        this._ensureBuffer(4);
        const value = this._buffer.readInt32LE(0);
        this._buffer = this._buffer.slice(4);
        if (LOG_EVERY_READ) {
            console.log("readInt32", value, this._getStackTrace());
        }
        return value;
    }

    readBigInt64LE(buffer, offset = 0) {
        const low = BigInt(buffer.readUInt32LE(offset)); // Read the lower 32 bits as unsigned
        const high = BigInt(buffer.readInt32LE(offset + 4)); // Read the upper 32 bits as signed

        return (high << 32n) | low; // Combine the two parts
    }

    readInt64() {
        this._ensureBuffer(8);
        const value = this.readBigInt64LE(this._buffer, 0);
        this._buffer = this._buffer.slice(8);
        if (LOG_EVERY_READ) {
            console.log("readInt64", value, this._getStackTrace());
        }
        return value;
    }

    readUInt16() {
        this._ensureBuffer(2);
        const value = this._buffer.readUInt16LE(0);
        this._buffer = this._buffer.slice(2);
        if (LOG_EVERY_READ) {
            console.log("readUInt16", value, this._getStackTrace());
        }
        return value;
    }

    readUInt32() {
        this._ensureBuffer(4);
        const value = this._buffer.readUInt32LE(0);
        this._buffer = this._buffer.slice(4);
        if (LOG_EVERY_READ) {
            console.log("readUInt32", value, this._getStackTrace());
        }
        return value;
    }

    readBigUInt64LE(buffer, offset = 0) {
        const low = BigInt(buffer.readUInt32LE(offset)); // Read the lower 32 bits as unsigned
        const high = BigInt(buffer.readUInt32LE(offset + 4)); // Read the upper 32 bits as unsigned

        return (high << 32n) | low; // Combine the two parts
    }

    readUInt64() {
        this._ensureBuffer(8);
        const value = this.readBigUInt64LE(this._buffer, 0);
        this._buffer = this._buffer.slice(8);
        if (LOG_EVERY_READ) {
            console.log("readUInt64", value, this._getStackTrace());
        }
        return value;
    }

    readChar() {
        const value = String.fromCharCode(this.readByte());
        if (LOG_EVERY_READ) {
            console.log("readChar", value, this._getStackTrace());
        }
        return value;
    }

    readDouble() {
        this._ensureBuffer(8);
        const value = this._buffer.readDoubleLE(0);
        this._buffer = this._buffer.slice(8);
        if (LOG_EVERY_READ) {
            console.log("readDouble", value, this._getStackTrace());
        }
        return value;
    }

    readSingle() {
        this._ensureBuffer(4);
        const value = this._buffer.readFloatLE(0);
        this._buffer = this._buffer.slice(4);
        if (LOG_EVERY_READ) {
            console.log("readSingle", value, this._getStackTrace());
        }
        return value;
    }

    readString() {
        let size = 0;
        let shift = 0;
        while (true) {
            this._ensureBuffer(1);
            const _siz = this._buffer[0];
            this._buffer = this._buffer.slice(1);
            size = size + ((0x7f & _siz) << shift);
            shift += 7;
            if (_siz < 128) break;
        }
        if (LOG_EVERY_READ) {
            console.log("readString (size)", size, this._getStackTrace());
        }
        this._ensureBuffer(size);
        const value = this._buffer.toString('utf8', 0, size);
        this._buffer = this._buffer.slice(size);
        if (LOG_EVERY_READ) {
            console.log("readString", value, this._getStackTrace());
        }
        return value;
    }

    readTimeSpan() {
        const value = this.readInt64();
        if (LOG_EVERY_READ) {
            console.log("readTimeSpan", value, this._getStackTrace());
        }
        return value;
    }

    readDecimal() {
        this._ensureBuffer(16); // Ensure the buffer has 16 bytes (128 bits)
        const value = new Decimal(this._buffer);
        this._buffer = this._buffer.slice(16);

        if (LOG_EVERY_READ) {
            console.log("readDecimal", value, value.toNumber(), this._getStackTrace());
        }
        return value;
    }
}

export default BinaryReader;