import ArrayInfo from './ArrayInfo';

class ArraySingleObjectRecord {
    static className = "ArraySingleObjectRecord";
    constructor() {
        this.arrayInfo = null;
    }

    read(reader) {
        this.arrayInfo = new ArrayInfo();
        this.arrayInfo.read(reader);
    }
}

export default ArraySingleObjectRecord;