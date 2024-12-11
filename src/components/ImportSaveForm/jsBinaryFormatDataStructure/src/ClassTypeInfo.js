class ClassTypeInfo {
    constructor() {
        this.typeName = '';
        this.libraryId = 0;
    }

    read(reader) {
        this.typeName = reader.readString();
        this.libraryId = reader.readInt32();
    }
}

export default ClassTypeInfo;