let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");

describe("Coordinate", () => {
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
});
