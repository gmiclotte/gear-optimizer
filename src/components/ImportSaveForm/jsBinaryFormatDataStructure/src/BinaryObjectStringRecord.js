class BinaryObjectStringRecord {
    constructor() {
        this.objectId = 0;
        this.value = '';
    }

    read(reader) {
        this.objectId = reader.readInt32();
        this.value = reader.readString();
    }
}

export default BinaryObjectStringRecord;