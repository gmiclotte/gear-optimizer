class ClassWithIdRecord {
    constructor() {
        this.objectId = 0;
        this.metadataId = 0;
    }

    read(reader) {
        this.objectId = reader.readInt32();
        this.metadataId = reader.readInt32();
    }
}

export default ClassWithIdRecord;