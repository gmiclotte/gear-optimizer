const BinaryArrayType = {
    Single: 0, // A single-dimensional Array.
    Jagged: 1, // An Array whose elements are Arrays. The elements of a jagged Array can be of different dimensions and sizes.
    Rectangular: 2, // A multi-dimensional rectangular Array.
    SingleOffset: 3, // A single-dimensional offset.
    JaggedOffset: 4, // A jagged Array where the lower bound index is greater than 0.
    RectangularOffset: 5 // Multi-dimensional Arrays where the lower bound index of at least one of the dimensions is greater than 0.
};

export default BinaryArrayType;