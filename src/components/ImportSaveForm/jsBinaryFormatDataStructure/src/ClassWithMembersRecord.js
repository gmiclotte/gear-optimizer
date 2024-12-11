import ClassInfo from "./ClassInfo";

class ClassWithMembersRecord {
    constructor() {
        this.classInfo = null;
        this.libraryId = 0;
    }

    read(reader) {
        this.classInfo = new ClassInfo();
        this.classInfo.read(reader);
        this.libraryId = reader.readInt32();
    }
}

export default ClassWithMembersRecord;