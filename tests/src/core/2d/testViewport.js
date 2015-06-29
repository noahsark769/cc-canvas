let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");

describe("Viewport", () => {
    it("should import correctly", () => {});
    it("should report coordinates in bounds", () => {
        let viewport = Viewport.constructFromSideLength(
            new Coordinate(0, 0), 3
        );
        let result = [];
        for (let coord of viewport.coordinatesInBounds()) {
            result.push(coord.x);
            result.push(coord.y);
        }
        expect(result).to.deep.equal([
            0, 0,
            1, 0,
            2, 0,
            0, 1,
            1, 1,
            2, 1,
            0, 2,
            1, 2,
            2, 2,
        ]);
    });
    it("should know about its center", () => {
        let viewport = Viewport.constructFromSideLength(
            new Coordinate(1, 0), 3
        );
        expect(viewport.getCenter().asArray()).to.deep.equals([2, 1]);
    });
    it("should report max and min of bounded space", () => {
        let viewport = Viewport.constructFromSideLength(
            new Coordinate(1, 2), 3
        );
        expect(viewport.getMaxX()).to.equal(3);
        expect(viewport.getMinX()).to.equal(1);
        expect(viewport.getMaxY()).to.equal(4);
        expect(viewport.getMinY()).to.equal(2);
    });
    it("should shift correctly", () => {
        let viewport = Viewport.constructFromSideLength(
            new Coordinate(0, 0), 3
        );
        viewport.shiftRight(1);
        expect(viewport.getCenter().asArray()).to.deep.equals([2, 1]);
        viewport.shiftRight(2);
        expect(viewport.getCenter().asArray()).to.deep.equals([4, 1]);
        viewport.shiftDown(1);
        expect(viewport.getCenter().asArray()).to.deep.equals([4, 2]);
        viewport.shiftLeft(1);
        expect(viewport.getCenter().asArray()).to.deep.equals([3, 2]);
        viewport.shiftUp(1);
        expect(viewport.getCenter().asArray()).to.deep.equals([3, 1]);
        viewport.shiftUp(0);
        expect(viewport.getCenter().asArray()).to.deep.equals([3, 1]);
    });
    it("should shift correctly with bounds", () => {
        let viewport = Viewport.constructFromSideLength(
            new Coordinate(0, 0), 3
        );
        viewport.shiftRightBounded(1, 4);
        viewport.shiftRightBounded(1, 4);
        viewport.shiftRightBounded(1, 4);
        expect(viewport.getCenter().asArray()).to.deep.equals([2, 1]);
        viewport.shiftLeftBounded(1, -1);
        viewport.shiftLeftBounded(1, -1);
        viewport.shiftLeftBounded(1, -1);
        expect(viewport.getCenter().asArray()).to.deep.equals([1, 1]);
        viewport.shiftDownBounded(1, 4);
        viewport.shiftDownBounded(1, 4);
        viewport.shiftDownBounded(1, 4);
        expect(viewport.getCenter().asArray()).to.deep.equals([1, 2]);
        viewport.shiftUpBounded(1, -1);
        viewport.shiftUpBounded(1, -1);
        viewport.shiftUpBounded(1, -1);
        expect(viewport.getCenter().asArray()).to.deep.equals([1, 1]);
    });
});
