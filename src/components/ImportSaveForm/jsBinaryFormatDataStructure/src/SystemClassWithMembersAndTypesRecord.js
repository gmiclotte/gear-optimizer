const MemberTypeInfo = require("./MemberTypeInfo");
const SystemClassWithMembersRecord = require("./SystemClassWithMembersRecord");

class SystemClassWithMembersAndTypesRecord extends SystemClassWithMembersRecord {
    read(reader) {
        const library = super.read(reader);
        this.memberTypeInfo = new MemberTypeInfo();
        this.memberTypeInfo.read(this.classInfo.memberCount, reader);
        return library;
    }
}

module.exports = SystemClassWithMembersAndTypesRecord;