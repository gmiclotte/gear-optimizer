import ClassSerializationRecord from './ClassSerializationRecord';
import ClassInfo from './ClassInfo';
import MemberTypeInfo from './MemberTypeInfo';

class ClassWithMembersAndTypesRecord extends ClassSerializationRecord {
    read(reader) {
        this.classInfo = new ClassInfo();
        this.classInfo.read(reader);
        this.memberTypeInfo = new MemberTypeInfo();
        this.memberTypeInfo.read(this.classInfo.memberCount, reader);
        this.libraryId = reader.readInt32();
    }
}

export default ClassWithMembersAndTypesRecord;