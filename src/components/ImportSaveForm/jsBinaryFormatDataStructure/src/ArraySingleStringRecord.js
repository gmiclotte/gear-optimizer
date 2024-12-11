const ArrayInfo = require('./ArrayInfo');

class ArraySingleStringRecord {
    constructor() {
        this.arrayInfo = null;
    }

    read(reader) {
        this.arrayInfo = new ArrayInfo();
        this.arrayInfo.read(reader);
    }
}

module.exports = ArraySingleStringRecord;