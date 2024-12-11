class ObjectNullMultipleRecord {
    constructor() {
        this.nullCount = 0;
    }

    read(reader, is256) {
        if (is256) {
            this.nullCount = reader.readByte();
        } else {
            this.nullCount = reader.readInt32();
        }
    }
}

export default ObjectNullMultipleRecord;