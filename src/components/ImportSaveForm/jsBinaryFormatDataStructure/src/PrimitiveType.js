// Enum for primitive types
const PrimitiveType = Object.freeze({
    None: 0,
    Boolean: 1, // Identifies a BOOLEAN as specified in [MS-DTYP] section 2.2.4.
    Byte: 2, // Identifies a BYTE as specified in [MS-DTYP] section 2.2.6.
    Char: 3, // Identifies a Char (section 2.1.1.1) type.
    // 4 The value is not used in the protocol.
    Decimal: 5, // Identifies a Decimal (section 2.1.1.7).
    Double: 6, // Identifies a Double (section 2.1.1.2).
    Int16: 7, // Identifies an INT16 as specified in [MS-DTYP] section 2.2.21.
    Int32: 8, // Identifies an INT32 as specified in [MS-DTYP] section 2.2.22.
    Int64: 9, // Identifies an INT64 as specified in [MS-DTYP] section 2.2.23.
    SByte: 10, // Identifies an INT8 as specified in [MS-DTYP] section 2.2.20.
    Single: 11, // Identifies a Single (section 2.1.1.3).
    TimeSpan: 12, // Identifies a TimeSpan (section 2.1.1.4).
    DateTime: 13, // Identifies a DateTime (section 2.1.1.5).
    UInt16: 14, // Identifies a UINT16 as specified in [MS-DTYP] section 2.2.48.
    UInt32: 15, // Identifies a UINT32 as specified in [MS-DTYP] section 2.2.49.
    UInt64: 16, // Identifies a UINT64 as specified in [MS-DTYP] section 2.2.50.
    Null: 17, // Identifies a Null Object.
    String: 18 // Identifies a LengthPrefixedString (section 2.1.1.6) value.
});

export default PrimitiveType;