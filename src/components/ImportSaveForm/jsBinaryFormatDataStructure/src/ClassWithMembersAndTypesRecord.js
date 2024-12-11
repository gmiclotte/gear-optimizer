const ClassSerializationRecord = require('./ClassSerializationRecord');
const ClassInfo = require('./ClassInfo');
const MemberTypeInfo = require('./MemberTypeInfo');

class ClassWithMembersAndTypesRecord extends ClassSerializationRecord {
    read(reader) {
        this.classInfo = new ClassInfo();
        this.classInfo.read(reader);
        this.memberTypeInfo = new MemberTypeInfo();
        this.memberTypeInfo.read(this.classInfo.memberCount, reader);
        this.libraryId = reader.readInt32();
    }
}

module.exports = ClassWithMembersAndTypesRecord;