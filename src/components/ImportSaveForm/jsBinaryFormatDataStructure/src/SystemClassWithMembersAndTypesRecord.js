import MemberTypeInfo from "./MemberTypeInfo";
import SystemClassWithMembersRecord from "./SystemClassWithMembersRecord";

class SystemClassWithMembersAndTypesRecord extends SystemClassWithMembersRecord {
    read(reader) {
        const library = super.read(reader);
        this.memberTypeInfo = new MemberTypeInfo();
        this.memberTypeInfo.read(this.classInfo.memberCount, reader);
        return library;
    }
}

export default SystemClassWithMembersAndTypesRecord;