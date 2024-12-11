const ArrayInfo = require('./ArrayInfo');

class ArraySinglePrimitiveRecord {
    constructor() {
        this.arrayInfo = null;
        this.primitiveType = null;
    }

    read(reader) {
        this.arrayInfo = new ArrayInfo();
        this.arrayInfo.read(reader);
        this.primitiveType = reader.readByte();
    }
}

module.exports = ArraySinglePrimitiveRecord;