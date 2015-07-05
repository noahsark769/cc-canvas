let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { ObjectLinkedList } = reqlib("/src/util/ObjectLinkedList");

describe("ObjectLinkedList", () => {
    it("should import correctly", () => {});
    it("should append correctly", () => {
        let o1 = {1: 2};
        let o2 = {3: 4};
        let l = new ObjectLinkedList("name");
        l.append(o1);
        l.append(o2);
        expect(Array.from(l.objects())).to.deep.equals([o1, o2]);
    });
    it("should report length correctly", () => {
        let o1 = {1: 2};
        let o2 = {3: 4};
        let l = new ObjectLinkedList("name");
        expect(l.length).to.equal(0);
        l.append(o1);
        expect(l.length).to.equal(1);
        l.append(o2);
        expect(l.length).to.equal(2);
        l.remove(o1);
        expect(l.length).to.equal(1);
        l.remove(o2);
        expect(l.length).to.equal(0);
    });
    it("should prepend correctly", () => {
        let o1 = {1: 2};
        let o2 = {3: 4};
        let l = new ObjectLinkedList("name");
        l.prepend(o1);
        l.prepend(o2);
        expect(Array.from(l.objects())).to.deep.equals([o2, o1]);
    });
    it("should remove correctly", () => {
        let o1 = {1: 2};
        let o2 = {3: 4};
        let l = new ObjectLinkedList("name");
        l.append(o1);
        l.append(o2);
        l.remove(o1);
        l.remove(o2);
        l.append(o1);
        l.append(o2);
        l.remove(o1);
        l.remove(o2);
        expect(Array.from(l.objects())).to.deep.equals([]);
    });
    it("should allow two different linked lists", () => {
        let o1 = {1: 2};
        let l1 = new ObjectLinkedList("one");
        let l2 = new ObjectLinkedList("two");
        l1.append(o1);
        l2.append(o1);
        l1.remove(o1);
        expect(Array.from(l1.objects())).to.deep.equals([]);
        expect(Array.from(l2.objects())).to.deep.equals([o1]);
    });
});
