import ArrayInfo from './ArrayInfo';

class ArraySingleStringRecord {
    static className = "ArraySingleStringRecord";
    constructor() {
        this.arrayInfo = null;
    }

    read(reader) {
        this.arrayInfo = new ArrayInfo();
        this.arrayInfo.read(reader);
    }
}

export default ArraySingleStringRecord;