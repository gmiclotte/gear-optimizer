class DeferredItem {
    constructor(owner, member, id, deferredAction) {
        this.owner = owner;
        this.member = member;
        this.id = id;
        this.deferredAction = deferredAction;
    }
}

export default DeferredItem;