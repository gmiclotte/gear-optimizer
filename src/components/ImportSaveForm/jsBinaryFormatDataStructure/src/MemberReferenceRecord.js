class MemberReferenceRecord {
    constructor() {
        this.idRef = 0;
    }

    read(reader) {
        this.idRef = reader.readInt32();
    }
}

module.exports = MemberReferenceRecord;