const BinaryType = Object.freeze({
    Primitive: 0, // The Remoting Type is defined in PrimitiveTypeEnumeration and the Remoting Type is not a string.
    String: 1, // The Remoting Type is a LengthPrefixedString.
    Object: 2, // The Remoting Type is System.Object.
    SystemClass: 3, // The Remoting Type is one of the following:
                    // A Class (2) in the System Library
                    // An Array whose Ultimate Array Item Type is a Class (2) in the System Library
                    // An Array whose Ultimate Array Item Type is System.Object, String, or a Primitive Type but does not meet the definition of ObjectArray, StringArray, or PrimitiveArray.
    Class: 4, // The Remoting Type is a Class (2) or an Array whose Ultimate Array Item Type is a Class (2) that is not in the System Library.
    ObjectArray: 5, // The Remoting Type is a single-dimensional Array of System.Object with a lower bound of 0.
    StringArray: 6, // The Remoting Type is a single-dimensional Array of String with a lower bound of 0.
    PrimitiveArray: 7 // The Remoting Type is a single-dimensional Array of Primitive Type with a lower bound of 0.
});

export default BinaryType;