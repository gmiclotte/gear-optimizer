class ArrayInfo {
    constructor() {
        this.objectId = 0;
        this.length = 0;
    }

    read(reader) {
        this.objectId = reader.readInt32();
        this.length = reader.readInt32();
    }
}

export default ArrayInfo;