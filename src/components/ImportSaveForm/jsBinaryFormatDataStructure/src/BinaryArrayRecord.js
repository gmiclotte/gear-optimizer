import BinaryArrayType from './BinaryArrayType';
import BinaryType from './BinaryType';
import ClassTypeInfo from './ClassTypeInfo';
import PrimitiveType from "./PrimitiveType";

class BinaryArrayRecord {
    static className = "BinaryArrayRecord";
    constructor() {
        this.objectId = 0;
        this.binaryArrayType = null;
        this.rank = 0;
        this.lengths = [];
        this.lowerBounds = [];
        this.binaryType = null;
        this.primitiveType = PrimitiveType.None;
        this.systemClassName = '';
        this.classTypeInfo = null;
    }

    read(reader) {
        this.objectId = reader.readInt32();
        this.binaryArrayType = reader.readByte();
        this.rank = reader.readInt32();
        this.lengths = new Array(this.rank);
        for (let i = 0; i < this.rank; i++) {
            this.lengths[i] = reader.readInt32();
        }
        if (this.binaryArrayType === BinaryArrayType.SingleOffset ||
            this.binaryArrayType === BinaryArrayType.JaggedOffset ||
            this.binaryArrayType === BinaryArrayType.RectangularOffset) {
            this.lowerBounds = new Array(this.rank);
            for (let i = 0; i < this.rank; i++) {
                this.lowerBounds[i] = reader.readInt32();
            }
        }
        this.binaryType = reader.readByte();
        switch (this.binaryType) {
            case BinaryType.Primitive:
            case BinaryType.PrimitiveArray:
                this.primitiveType = reader.readByte();
                break;
            case BinaryType.SystemClass:
                this.systemClassName = reader.readString();
                break;
            case BinaryType.Class:
                this.classTypeInfo = new ClassTypeInfo();
                this.classTypeInfo.read(reader);
                break;
            default:
                throw new Error(`Unsupported binary type: ${this.binaryType}`);
        }
    }
}

export default BinaryArrayRecord;