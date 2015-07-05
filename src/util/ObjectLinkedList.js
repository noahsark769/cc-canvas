class Node {
    constructor(obj, prev = null, next = null) {
        this.object = obj;
        this.next = next;
        this.prev = prev;
    }
}

// fairly simple doubly linked list
export class ObjectLinkedList {
    constructor(name) {
        this.name = name;
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    append(obj) {
        if (obj["__ObjectLinkedList__" + this.name]) {
            console.warn("Trying to put an object into an ObjectLinkedList, but it already has an associated node!!");
        }
        let node = new Node(obj);
        obj["__ObjectLinkedList__" + this.name] = node;
        if (this.tail === null) {
            this.head = node;
            this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }
        this.length++;
    }
    prepend(obj) {
        if (obj["__ObjectLinkedList__" + this.name]) {
            console.warn("Trying to put an object into an ObjectLinkedList, but it already has an associated node!!");
        }
        let node = new Node(obj);
        obj["__ObjectLinkedList__" + this.name] = node;
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        this.length++;
    }
    remove(obj) {
        let node = obj["__ObjectLinkedList__" + this.name];
        if (!node) {
            console.warn("Trying to remove an object from an ObjectLinkedList, but it doesn't know about its node. You removed it alread?");
        } else {
            if (this.head === node) {
                this.head = this.head.next;
                if (this.head) {
                    this.head.prev = null;
                }
                node.next = null;
            } else if (this.tail === node) {
                this.tail = this.tail.prev;
                if (this.tail) {
                    this.tail.next = null;
                }
                node.prev = null;
            } else {
                node.prev.next = node.next;
                node.next.prev = node.prev;
                node.next = null;
                node.prev = null;
            }
            obj["__ObjectLinkedList__" + this.name] = undefined;
        }
        this.length--;
    }
    *objects() {
        let node = this.head;
        while (node !== null) {
            yield node.object;
            node = node.next;
        }
    }
}
