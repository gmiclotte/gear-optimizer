class BinaryObject {
    constructor(typeName, assemblyName) {
        if (!typeName || !assemblyName) {
            throw new Error(`BinaryObject typeName ${typeName} or assemblyName ${assemblyName} are invalid`);
        }
        this._members = new Map();
        this.typeName = typeName;
        this.assemblyName = assemblyName;
        this.referenceObject = null;
    }

    get count() {
        return this._members.size;
    }

    get keys() {
        return Array.from(this._members.keys());
    }

    get(memberName) {
        return this._members.get(memberName) || null;
    }

    containsKey(memberName) {
        return this._members.has(memberName);
    }

    [Symbol.iterator]() {
        return this._members[Symbol.iterator]();
    }

    tryGetValue(memberName) {
        if (this._members.has(memberName)) {
            return {found: true, value: this._members.get(memberName)};
        }
        return {found: false, value: null};
    }

    addMember(memberName, value) {
        this._members.set(memberName, value);
    }
}

export default BinaryObject;