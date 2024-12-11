class SerializationHeaderRecord {
    constructor() {
        this.rootId = 0;
        this.headerId = 0;
        this.majorVersion = 0;
        this.minorVersion = 0;
    }

    readAndValidate(reader) {
        this.rootId = reader.readInt32();
        this.headerId = reader.readInt32();
        this.majorVersion = reader.readInt32();
        this.minorVersion = reader.readInt32();

        if (this.majorVersion !== 1 || this.minorVersion !== 0) {
            throw new Error("Invalid NRBF stream");
        }
    }
}

export default SerializationHeaderRecord;