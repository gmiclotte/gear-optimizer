const PrimitiveReader = require('./PrimitiveReader');

class MemberPrimitiveTypedRecord {
    constructor() {
        this.primitiveType = null;
        this.value = null;
    }

    read(reader) {
        this.primitiveType = reader.readByte();
        this.value = PrimitiveReader.read(this.primitiveType, reader);
    }
}

module.exports = MemberPrimitiveTypedRecord;