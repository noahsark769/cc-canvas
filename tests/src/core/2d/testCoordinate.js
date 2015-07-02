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
    it("should support .asArray", () => {
        let c = new Coordinate(4, 5);
        expect(c.asArray()).to.deep.equal([4, 5]);
    });
    it("should know about differences", () => {
        let a = new Coordinate(0, 0);
        let b = new Coordinate(0, 0);
        let c = new Coordinate(1, 1);
        let d = new Coordinate(0, 1);
        let e = new Coordinate(1, 0);
        expect(a.isDifferentFrom(b)).to.be.false;
        expect(a.isDifferentFrom(c)).to.be.true;
        expect(c.isDifferentFrom(b)).to.be.true;
        expect(a.isDifferentFrom(d)).to.be.true;
        expect(a.isDifferentFrom(e)).to.be.true;
    });
    describe("relative constructions", () => {
        var c;
        beforeEach(() => {
            c = new Coordinate(5, 5);
        });

        let expectToBe = function(coord, x, y) {
            expect(coord.x).to.equal(x);
            expect(coord.y).to.equal(y);
        };

        it("should support .downFrom()", () => {
            let newCoord = c.downFrom();
            expectToBe(newCoord, 5, 6);
        });

        it("should support .upFrom()", () => {
            let newCoord = c.upFrom();
            expectToBe(newCoord, 5, 4);
        });

        it("should support .leftFrom()", () => {
            let newCoord = c.leftFrom();
            expectToBe(newCoord, 4, 5);
        });

        it("should support .rightFrom()", () => {
            let right = c.rightFrom();
            expectToBe(right, 6, 5);
        });
    });
});
