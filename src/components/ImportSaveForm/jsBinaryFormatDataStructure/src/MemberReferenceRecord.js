class MemberReferenceRecord {
    constructor() {
        this.idRef = 0;
    }

    read(reader) {
        this.idRef = reader.readInt32();
    }
}

export default MemberReferenceRecord;