import ClassSerializationRecord from "./ClassSerializationRecord";
import ClassInfo from "./ClassInfo";

class SystemClassWithMembersRecord extends ClassSerializationRecord {
    read(reader) {
        this.classInfo = new ClassInfo();
        this.classInfo.read(reader);

        // The libraryId is stored in the class name, so we need to parse it out
        const className = this.classInfo.name;
        const regex = /^(.*)`(\d+)\[\[(.*)\]\]$/;
        this.libraryId = -1;
        if (!className.match(regex)) {
            return {};
        }
        const [_, typeName, libraryId, library] = className.match(regex);
        this.classInfo.name = typeName;
        this.libraryId = libraryId;
        return library;
    }
}

export default SystemClassWithMembersRecord;