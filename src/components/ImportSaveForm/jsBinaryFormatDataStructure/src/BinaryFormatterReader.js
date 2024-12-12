import BinaryReader from './BinaryReader';
import BinaryObject from './BinaryObject';
import BinaryLibraryRecord from './BinaryLibraryRecord';
import ClassWithIdRecord from './ClassWithIdRecord';
import SystemClassWithMembersRecord from './SystemClassWithMembersRecord';
import ClassWithMembersRecord from './ClassWithMembersRecord';
import SystemClassWithMembersAndTypesRecord from './SystemClassWithMembersAndTypesRecord';
import ClassWithMembersAndTypesRecord from './ClassWithMembersAndTypesRecord';
import BinaryObjectStringRecord from './BinaryObjectStringRecord';
import BinaryArrayRecord from './BinaryArrayRecord';
import MemberPrimitiveTypedRecord from './MemberPrimitiveTypedRecord';
import MemberReferenceRecord from './MemberReferenceRecord';
import ObjectNullMultipleRecord from './ObjectNullMultipleRecord';
import ArraySinglePrimitiveRecord from './ArraySinglePrimitiveRecord';
import ArraySingleObjectRecord from './ArraySingleObjectRecord';
import ArraySingleStringRecord from './ArraySingleStringRecord';
import PrimitiveReader from './PrimitiveReader';
import DeferredReference from './DeferredReference';
import DeferredItem from './DeferredItem';
import RecordType from './RecordType';
import SerializationHeaderRecord from './SerializationHeaderRecord';
import ClassSerializationRecord from "./ClassSerializationRecord";
import PrimitiveType from "./PrimitiveType";
import BinaryType from "./BinaryType";
import BinaryArrayType from "./BinaryArrayType";

export class NRBFReader {
    constructor(buffer, pos = 0) {
        buffer = buffer.slice(pos);
        this._reader = new BinaryReader(buffer);
        this._endOfBuffer = false;
        this._objectTracker = new Map();
        this._libraries = new Map();
        this._deferredItems = [];
        this._records = [];
    }

    static readBuffer(buffer, pos = 0) {
        const instance = new NRBFReader(buffer, pos);
        return instance.parse();
    }

    parse() {
        const recordType = this._reader.readByte();
        if (recordType !== RecordType.SerializedStreamHeader) {
            throw new Error('Invalid NRBF stream');
        }

        const header = new SerializationHeaderRecord();
        header.readAndValidate(this._reader);

        while (!this._endOfBuffer) {
            try {
                const record = this.read();
                this._records.push(record);
            } catch (error) {
                this._objectTracker = Array.from(this._objectTracker.entries());
                this._libraries = Array.from(this._libraries.entries());
                this._reader = null;
                error.instance = this;
                throw error;
            }
        }

        // process the deferred items
        this.completeDeferredItems();
        const root = this.dereferenceTrackedObject(header.rootId);
        // cleanup the instance
        this.cleanup();
        // return the instance and the parsed records
        return [this, root]
    }

    cleanup() {
        this._objectTracker = Array.from(this._objectTracker.entries());
        this._libraries = Array.from(this._libraries.entries());
        this._deferredItems = this._deferredItems.map((item) => {
            return {
                id: item.id,
                owner: item.owner,
                member: item.member,
                deferredAction: item.deferredAction ? item.deferredAction.toString() : undefined,
            };
        });
        this._reader = null;
    }

    read() {
        return this.readRecord();
    }

    readRecord() {
        const recordType = this._reader.readByte();
        let currentObject = null;

        switch (recordType) {
            case RecordType.ClassWithId:
                currentObject = this.readClassWithId();
                break;
            case RecordType.SystemClassWithMembers:
                currentObject = this.readSystemClassWithMembers();
                break;
            case RecordType.ClassWithMembers:
                currentObject = this.readClassWithMembers();
                break;
            case RecordType.SystemClassWithMembersAndTypes:
                currentObject = this.readSystemClassWithMembersAndTypes();
                break;
            case RecordType.ClassWithMembersAndTypes:
                currentObject = this.readClassWithMembersAndTypes();
                break;
            case RecordType.BinaryObjectString:
                currentObject = this.readBinaryObjectString();
                break;
            case RecordType.BinaryArray:
                currentObject = this.readBinaryArray();
                break;
            case RecordType.MemberPrimitiveTyped:
                currentObject = this.readMemberPrimitiveTyped();
                break;
            case RecordType.MemberReference:
                currentObject = this.readMemberReference();
                break;
            case RecordType.ObjectNull:
                return null;
            case RecordType.MessageEnd:
                this._endOfBuffer = true;
                break;
            case RecordType.BinaryLibrary:
                this.readBinaryLibrary();
                break;
            case RecordType.ObjectNullMultiple256:
                currentObject = this.readObjectNullMultiple(true);
                break;
            case RecordType.ObjectNullMultiple:
                currentObject = this.readObjectNullMultiple(false);
                break;
            case RecordType.ArraySinglePrimitive:
                currentObject = this.readArraySinglePrimitive();
                break;
            case RecordType.ArraySingleObject:
                currentObject = this.readArraySingleObject();
                break;
            case RecordType.ArraySingleString:
                currentObject = this.readArraySingleString();
                break;
            default:
                throw new Error(`RecordType: ${recordType} not supported`);
        }

        return currentObject;
    }

    readClassWithId() {
        const result = new ClassWithIdRecord();
        result.read(this._reader);

        const classRef = this._objectTracker.get(result.metadataId);

        result.value = new BinaryObject(
            classRef.classInfo.name,
            this._libraries.get(classRef.libraryId),
        );

        if (result.objectId !== 0) {
            this._objectTracker.set(result.objectId, result.value);
        }

        if (!classRef.memberTypeInfo) {
            this.readUntypedMembers(result.value, result.value.typeName, classRef.classInfo.memberNames);
        } else {
            this.readMembers(result.value, classRef.classInfo.memberNames, classRef.memberTypeInfo);
        }

        return result;
    }

    readSystemClassWithMembers() {
        const result = new SystemClassWithMembersRecord();
        const library = result.read(this._reader);
        this._libraries.set(result.libraryId, library);

        result.value = new BinaryObject(
            result.classInfo.name,
            this._libraries.get(result.libraryId),
        );

        if (result.classInfo.objectId !== 0) {
            this._objectTracker.set(result.classInfo.objectId, result);
        }

        this.readUntypedMembers(result.value, result.classInfo.name, result.classInfo.memberNames);
        return result;
    }

    readClassWithMembers() {
        const result = new ClassWithMembersRecord();
        result.read(this._reader);

        result.value = new BinaryObject(
            result.classInfo.name,
            this._libraries.get(result.libraryId),
        );

        if (result.classInfo.objectId !== 0) {
            this._objectTracker.set(result.classInfo.objectId, result);
        }

        this.readUntypedMembers(result.value, result.classInfo.name, result.classInfo.memberNames);
        return result;
    }

    readSystemClassWithMembersAndTypes() {
        const result = new SystemClassWithMembersAndTypesRecord();
        const library = result.read(this._reader);
        this._libraries.set(result.libraryId, library);

        result.value = new BinaryObject(
            result.classInfo.name,
            this._libraries.get(result.libraryId),
        );

        if (result.classInfo.objectId !== 0) {
            this._objectTracker.set(result.classInfo.objectId, result);
        }

        this.readMembers(result.value, result.classInfo.memberNames, result.memberTypeInfo);

        return result;
    }

    readClassWithMembersAndTypes() {
        const result = new ClassWithMembersAndTypesRecord();
        result.read(this._reader);

        result.value = new BinaryObject(
            result.classInfo.name,
            this._libraries.get(result.libraryId),
        );

        if (result.classInfo.objectId !== 0) {
            this._objectTracker.set(result.classInfo.objectId, result);
        }

        this.readMembers(result.value, result.classInfo.memberNames, result.memberTypeInfo);

        return result;
    }

    readBinaryObjectString() {
        const result = new BinaryObjectStringRecord();
        result.read(this._reader);

        const currentObject = result.value;
        if (result.objectId !== 0) {
            this._objectTracker.set(result.objectId, currentObject);
        }

        return currentObject;
    }

    readBinaryArray() {
        const result = new BinaryArrayRecord();
        result.read(this._reader);

        const currentObject = this.readArray(result);
        if (result.objectId !== 0) {
            this._objectTracker.set(result.objectId, currentObject);
        }

        return currentObject;
    }

    readMemberPrimitiveTyped() {
        const result = new MemberPrimitiveTypedRecord();
        result.read(this._reader);
        return result.value;
    }

    readMemberReference() {
        const result = new MemberReferenceRecord();
        result.read(this._reader);

        if (result.idRef === 0) {
            throw new Error('MemberReferenceRecord.idRef is 0');
        }

        let currentObject;
        if (this._objectTracker.has(result.idRef)) {
            const objectRef = this._objectTracker.get(result.idRef);
            currentObject = objectRef instanceof ClassSerializationRecord ? objectRef.value : objectRef;
        } else {
            currentObject = new DeferredReference(result.idRef);
        }

        return currentObject;
    }

    readBinaryLibrary() {
        const result = new BinaryLibraryRecord();
        result.read(this._reader);
        this._libraries.set(result.libraryId, result.libraryName);
    }

    readObjectNullMultiple(is256) {
        const result = new ObjectNullMultipleRecord();
        result.read(this._reader, is256);
        return result;
    }

    readArraySinglePrimitive() {
        const result = new ArraySinglePrimitiveRecord();
        result.read(this._reader);

        const currentObject = this.readArray(result);
        if (result.arrayInfo.objectId !== 0) {
            this._objectTracker.set(result.arrayInfo.objectId, currentObject);
        }

        return currentObject;
    }

    readArraySingleObject() {
        const result = new ArraySingleObjectRecord();
        result.read(this._reader);

        const currentObject = this.readArray(result);
        if (result.arrayInfo.objectId !== 0) {
            this._objectTracker.set(result.arrayInfo.objectId, currentObject);
        }

        return currentObject;
    }

    readArraySingleString() {
        const result = new ArraySingleStringRecord();
        result.read(this._reader);

        const currentObject = this.readArray(result);
        if (result.arrayInfo.objectId !== 0) {
            this._objectTracker.set(result.arrayInfo.objectId, currentObject);
        }

        return currentObject;
    }

    readMembers(owner, memberNames, memberTypeInfo) {
        for (let i = 0; i < memberNames.length; i++) {
            // case 1: primitive type
            if (memberTypeInfo.binaryType[i] === BinaryType.Primitive) {
                owner.addMember(memberNames[i], PrimitiveReader.read(memberTypeInfo.additionalInfos[i], this._reader));
                continue;
            }
            // case 2: object
            const memberClass = this.readRecord();
            // case 2.1: deferred
            if (memberClass instanceof DeferredReference) {
                this._deferredItems.push(new DeferredItem(
                    owner,
                    memberNames[i],
                    memberClass.id,
                    undefined,
                ));
                owner.addMember(memberNames[i], null);
                continue;
            }
            // case 2.2: direct
            owner.addMember(memberNames[i], memberClass);
        }
    }

    readUntypedMembers(owner, className, memberNames) {
        if (className === 'System.Guid' && memberNames.length === 11) {
            owner.addMember('_a', this._reader.readInt32());
            owner.addMember('_b', this._reader.readInt16());
            owner.addMember('_c', this._reader.readInt16());
            owner.addMember('_d', this._reader.readByte());
            owner.addMember('_e', this._reader.readByte());
            owner.addMember('_f', this._reader.readByte());
            owner.addMember('_g', this._reader.readByte());
            owner.addMember('_h', this._reader.readByte());
            owner.addMember('_i', this._reader.readByte());
            owner.addMember('_j', this._reader.readByte());
            owner.addMember('_k', this._reader.readByte());
        } else if (memberNames.length === 1 && memberNames[0] === 'value__') {
            owner.addMember(memberNames[0], this._reader.readInt32());
        } else {
            throw new Error(`Unsupported untyped member: ${className}`);
        }
    }

    readArray(record) {
        switch (record.constructor.className) {
            case 'ArraySinglePrimitiveRecord':
                return this.readArraySinglePrimitiveRecord(record);
            case 'ArraySingleStringRecord':
                return this.readArraySingleStringRecord(record);
            case 'ArraySingleObjectRecord':
                return this.readArraySingleObjectRecord(record);
            case 'BinaryArrayRecord':
                return this.readArrayBinaryRecord(record);
            default:
                throw new Error(`Unsupported array record type: ${record.constructor.name}`);
        }
    }

    readArraySinglePrimitiveRecord(record) {
        const result = new Array(record.arrayInfo.length);
        for (let i = 0; i < result.length; i++) {
            let entry;
            if (record.primitiveType === PrimitiveType.None) {
                entry = this.read();
            } else {
                entry = this._reader.read(record.primitiveType);
            }
            result[i] = entry;
        }
        return result;
    }

    readArraySingleStringRecord(record) {
        const result = new Array(record.arrayInfo.length);
        for (let i = 0; i < result.length; i++) {
            const value = this.read();
            if (typeof value === 'string') {
                result[i] = value;
            } else if (value instanceof ObjectNullMultipleRecord) {
                i += value.nullCount - 1;
            }
        }
        return result;
    }

    readArraySingleObjectRecord(record) {
        const result = new Array(record.arrayInfo.length);
        for (let i = 0; i < result.length; i++) {
            let value = this.read();
            if (value instanceof BinaryLibraryRecord) {
                // According to [MS-NRBF] section 2.7, ArraySingleObject element member references can be preceded
                // by exactly zero or one BinaryLibrary records, so if we just read a BinaryLibrary record, we should
                // skip it and read the following record.
                value = this.read();
            }

            if (value instanceof ObjectNullMultipleRecord) {
                i += value.nullCount - 1;
            } else if (value instanceof DeferredReference) {
                const setIndex = i;
                this._deferredItems.push(new DeferredItem(
                    record,
                    undefined,
                    value.id,
                    (resolvedValue) => result[setIndex] = resolvedValue,
                ));
            } else {
                result[i] = value;
            }
        }
        return result;
    }

    readArrayBinaryRecord(record) {
        let result;

        // Initialize the result array
        result = new Array(record.lengths.reduce((a, b) => a * b, 1)); // Create a flat array of specified length

        // Function to get the first index of a multi-dimensional array
        function firstIndex(lengths) {
            const indices = new Array(lengths.length).fill(0);
            for (let i = indices.length - 1; i >= 0; --i) {
                if (indices[i] >= lengths[i]) {
                    return null;
                }
            }
            return indices;
        }

        // Function to get the next index of a multi-dimensional array
        function nextIndex(lengths, indices) {
            for (let i = indices.length - 1; i >= 0; --i) {
                indices[i]++;
                if (indices[i] < lengths[i]) {
                    return indices;
                }
                indices[i] = 0;
            }
            return null;
        }

        // Helper function to flatten multi-dimensional indices into a single index for a flat array representation
        function flattenIndex(lengths, indices) {
            let index = 0;
            let factor = 1;
            for (let i = lengths.length - 1; i >= 0; i--) {
                index += indices[i] * factor;
                factor *= lengths[i];
            }
            return index;
        }

        // Determine if we are dealing with a jagged array or primitive type
        if (record.primitiveType === PrimitiveType.None || record.binaryArrayType === BinaryArrayType.Jagged) {
            if (record.binaryType !== BinaryType.Primitive) {
                let continueCount = 0;
                let lengths = record.lengths;

                for (let indices = firstIndex(lengths); indices != null; indices = nextIndex(lengths, indices)) {
                    if (continueCount > 0) {
                        continueCount--;
                        continue;
                    }

                    let value = this.read(); // Assume `read` is a function that reads the value and type from a source
                    if (value instanceof BinaryLibraryRecord) {
                        // According to [MS-NRBF] section 2.7, BinaryArray element member references can be preceded
                        // by exactly zero or one BinaryLibrary records, so if we just read a BinaryLibrary record, we should
                        // skip it and read the following record.
                        value = this.read();
                    }

                    if (value instanceof ObjectNullMultipleRecord) {
                        continueCount = value.nullCount - 1;
                    } else if (value instanceof DeferredReference) {
                        let setIndex = [...indices]; // Clone the indices
                        this._deferredItems.push(new DeferredItem(
                            undefined,
                            undefined,
                            value.id,
                            (resolvedValue) => result[flattenIndex(lengths, setIndex)] = resolvedValue,
                        ));
                    } else {
                        result[flattenIndex(lengths, indices)] = value;
                    }
                }
            } else {
                throw new Error("Unsupported array structure");
            }
        } else {
            let lengths = record.lengths;
            for (let indices = firstIndex(lengths); indices != null; indices = nextIndex(lengths, indices)) {
                let entry;
                if (record.primitiveType === PrimitiveType.None) {
                    entry = this.read();
                } else {
                    entry = this._reader.read(record.primitiveType);
                }
                result[flattenIndex(lengths, indices)] = entry;
            }
        }

        return result;
    }

    completeDeferredItems() {
        for (const deferredItem of this._deferredItems) {
            const referencedItem = this.dereferenceTrackedObject(deferredItem.id);
            if (referencedItem === undefined) {
                throw new Error(`DeferredItem with id ${deferredItem.id} not found`);
            }
            if (deferredItem.deferredAction) {
                deferredItem.deferredAction(referencedItem);
            } else {
                deferredItem.owner.addMember(deferredItem.member, referencedItem);
            }
        }
    }

    dereferenceTrackedObject(id) {
        return this._objectTracker.get(id);
    }
}