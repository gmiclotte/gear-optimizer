import PrimitiveType from './PrimitiveType';

class PrimitiveReader {
    static readTimeSpan(reader) {
        return new Date(reader.readInt64());
    }

    static readDateTime(reader) {
        const TicksMask = 0x3FFFFFFFFFFFFFFFn;
        const dateData = reader.readInt64();
        const ticks = dateData & TicksMask;
        return new Date(Number(ticks));
    }

    static read(type, reader) {
        switch (type) {
            case PrimitiveType.Boolean:
                return reader.readBoolean();
            case PrimitiveType.Byte:
                return reader.readByte();
            case PrimitiveType.Char:
                return reader.readChar();
            case PrimitiveType.Double:
                return reader.readDouble();
            case PrimitiveType.Int16:
                return reader.readInt16();
            case PrimitiveType.Int32:
                return reader.readInt32();
            case PrimitiveType.Int64:
                return reader.readInt64();
            case PrimitiveType.SByte:
                return reader.readSByte();
            case PrimitiveType.Single:
                return reader.readSingle();
            case PrimitiveType.UInt16:
                return reader.readUInt16();
            case PrimitiveType.UInt32:
                return reader.readUInt32();
            case PrimitiveType.UInt64:
                return reader.readUInt64();
            case PrimitiveType.Decimal:
                return parseFloat(reader.readString());
            case PrimitiveType.TimeSpan:
                return PrimitiveReader.readTimeSpan(reader);
            case PrimitiveType.DateTime:
                return PrimitiveReader.readDateTime(reader);
            default:
                throw new Error("Invalid primitive type: " + type);
        }
    }
}

export default PrimitiveReader;