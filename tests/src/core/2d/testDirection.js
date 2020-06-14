let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Direction } = reqlib("/src/core/2d/directions");

describe("Directions", () => {
    it("should support clockwise and counterclockwise", () => {
        expect(Direction.west().counterclockwise().equals(Direction.south()));
        expect(Direction.south().counterclockwise().equals(Direction.east()));
        expect(Direction.east().counterclockwise().equals(Direction.north()));
        expect(Direction.north().counterclockwise().equals(Direction.west()));

        expect(Direction.west().clockwise().equals(Direction.north()));
        expect(Direction.south().clockwise().equals(Direction.west()));
        expect(Direction.east().clockwise().equals(Direction.south()));
        expect(Direction.north().clockwise().equals(Direction.east()));
    });

    it("should support opposite", function() {
        expect(Direction.west().opposite().equals(Direction.east()));
        expect(Direction.south().opposite().equals(Direction.north()));
        expect(Direction.east().opposite().equals(Direction.west()));
        expect(Direction.north().opposite().equals(Direction.south())); 
    });

    it("should work with equality", function() {
        expect([Direction.west()].includes(Direction.west()));
        expect([Direction.north()].includes(Direction.north()));
        expect([Direction.east()].includes(Direction.east()));
        expect([Direction.south()].includes(Direction.south()));

        expect([Direction.south()].includes(Direction.west())).equals(false);
        expect([Direction.south()].includes(Direction.east())).equals(false);
        expect([Direction.south()].includes(Direction.north())).equals(false);
        
    })
});
