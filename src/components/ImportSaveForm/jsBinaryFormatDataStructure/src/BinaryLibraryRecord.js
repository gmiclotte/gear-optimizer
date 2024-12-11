class BinaryLibraryRecord {
    constructor() {
        this.libraryId = 0;
        this.libraryName = '';
    }

    read(reader) {
        this.libraryId = reader.readInt32();
        this.libraryName = reader.readString();
    }
}

export default BinaryLibraryRecord;