let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { CoordinateMap } = reqlib("/src/core/2d/CoordinateMap");

describe("CoordinateMap", () => {
    it("should import correctly", () => {});
    it("should support set/size", () => {
        let map = new CoordinateMap();
        expect(map.size).to.equal(0);
        map.set(0, 0, "value");
        expect(map.size).to.equal(1);
        map.set(-1, -1, "other value")
        expect(map.size).to.equal(2);
        map.set(0, 0, {something: 1});
    });
    it("should support get/has", () => {
        let map = new CoordinateMap();
        expect(map.get(0, 0)).to.be.undefined;
        expect(map.has(0, 0)).to.be.false;
        map.set(0, 0, "value");
        expect(map.get(0, 0)).to.equal("value");
        expect(map.has(0, 0)).to.be.true;
    });
    it("should support delete", () => {
        let map = new CoordinateMap();
        map.set(0, 0, "value");
        map.delete(0, 0);
        expect(map.size).to.equal(0);
        expect(map.has(0, 0)).to.be.false;
    });
});
