let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");

describe("Coordinate", () => {
    it("should import correctly", () => {});
    it("should construct with x and y", () => {
        let c = new Coordinate(0, 1);
        expect(c.x).to.equal(0);
        expect(c.y).to.equal(1);
    });
    it("should accept negatives", () => {
        let c = new Coordinate(-1, -1);
        expect(c.x).to.equal(-1);
        expect(c.y).to.equal(-1);
    });
    it("should support serialization", () => {
        let c = new Coordinate(4, 5);
        c = Coordinate.deserialize(c.serialize());
        expect(c.x).to.equal(4);
        expect(c.y).to.equal(5);
    });
});
