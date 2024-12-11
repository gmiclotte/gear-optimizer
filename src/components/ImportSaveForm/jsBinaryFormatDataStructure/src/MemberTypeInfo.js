import BinaryType from './BinaryType';
import ClassTypeInfo from './ClassTypeInfo';

class MemberTypeInfo {
    constructor() {
        this.binaryType = [];
        this.additionalInfos = [];
    }

    read(count, reader) {
        this.binaryType = new Array(count);

        for (let i = 0; i < count; i++) {
            this.binaryType[i] = reader.readByte();
        }

        this.additionalInfos = new Array(count);

        for (let i = 0; i < count; i++) {
            if (this.binaryType[i] === BinaryType.Primitive || this.binaryType[i] === BinaryType.PrimitiveArray) {
                this.additionalInfos[i] = reader.readByte();
            } else if (this.binaryType[i] === BinaryType.SystemClass) {
                this.additionalInfos[i] = reader.readString(); // System class name
            } else if (this.binaryType[i] === BinaryType.Class) {
                const typeInfo = new ClassTypeInfo();
                typeInfo.read(reader);
                this.additionalInfos[i] = typeInfo;
            }
        }
    }
}

export default MemberTypeInfo;