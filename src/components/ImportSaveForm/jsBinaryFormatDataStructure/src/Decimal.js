import BigInt from "core-js/features/bigint";

// Decimal mimicks a C# decimal structure, which is a 128-bit value.
// The toNumber method converts the C# decimal to a JavaScript number, this leads to a loss of precision.
// No other operations have been implemented.
export default class Decimal {
    constructor(buffer) {
        if (buffer.length !== 16) {
            throw new Error("Buffer length must be 16 bytes to represent a C# decimal");
        }
        this.buffer = buffer;
    }

    toNumber() {
        // Extract parts of the C# decimal structure
        const low = this.buffer.readUInt32LE(0);
        const mid = this.buffer.readUInt32LE(4);
        const high = this.buffer.readUInt32LE(8);
        const flags = this.buffer.readUInt32LE(12);

        // Extract sign and scale
        const sign = (flags & 0x80000000) ? -1 : 1;
        const scale = (flags >> 16) & 0x7F;

        // Combine the parts to form the full value
        let value = (BigInt(high) << 64n) + (BigInt(mid) << 32n) + BigInt(low);

        // Apply sign
        value = value * BigInt(sign);

        // Apply scaling
        return Number(value) / Math.pow(10, scale);
    }
}
