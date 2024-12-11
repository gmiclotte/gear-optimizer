// Enum for record types
const RecordType = Object.freeze({
    SerializedStreamHeader: 0, // Identifies the SerializationHeaderRecord.
    ClassWithId: 1, // Identifies a ClassWithId record.
    SystemClassWithMembers: 2, // Identifies a SystemClassWithMembers record.
    ClassWithMembers: 3, // Identifies a ClassWithMembers record.
    SystemClassWithMembersAndTypes: 4, // Identifies a SystemClassWithMembersAndTypes record.
    ClassWithMembersAndTypes: 5, // Identifies a ClassWithMembersAndTypes record.
    BinaryObjectString: 6, // Identifies a BinaryObjectString record.
    BinaryArray: 7, // Identifies a BinaryArray record.
    MemberPrimitiveTyped: 8, // Identifies a MemberPrimitiveTyped record.
    MemberReference: 9, // Identifies a MemberReference record.
    ObjectNull: 10, // Identifies an ObjectNull record.
    MessageEnd: 11, // Identifies a MessageEnd record.
    BinaryLibrary: 12, // Identifies a BinaryLibrary record.
    ObjectNullMultiple256: 13, // Identifies an ObjectNullMultiple256 record.
    ObjectNullMultiple: 14, // Identifies an ObjectNullMultiple record.
    ArraySinglePrimitive: 15, // Identifies an ArraySinglePrimitive record.
    ArraySingleObject: 16, // Identifies an ArraySingleObject record.
    ArraySingleString: 17, // Identifies an ArraySingleString record.
    MethodCall: 21, // Identifies a BinaryMethodCall record.
    MethodReturn: 22 // Identifies a BinaryMethodReturn record.
});

export default RecordType;