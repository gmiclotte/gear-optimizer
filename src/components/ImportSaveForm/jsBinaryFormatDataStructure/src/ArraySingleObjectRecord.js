import ArrayInfo from './ArrayInfo';

class ArraySingleObjectRecord {
    constructor() {
        this.arrayInfo = null;
    }

    read(reader) {
        this.arrayInfo = new ArrayInfo();
        this.arrayInfo.read(reader);
    }
}

export default ArraySingleObjectRecord;