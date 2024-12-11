class ClassInfo {
    constructor() {
        this.objectId = 0;
        this.name = '';
        this.memberCount = 0;
        this.memberNames = [];
    }

    read(reader) {
        this.objectId = reader.readInt32();
        this.name = reader.readString();
        this.memberCount = reader.readInt32();
        this.memberNames = new Array(this.memberCount);

        for (let i = 0; i < this.memberNames.length; i++) {
            this.memberNames[i] = reader.readString();
        }
    }
}

export default ClassInfo;