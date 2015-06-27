let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Level } = reqlib("/src/core/Level");

describe("Level", () => {
    it("should import correctly", () => {});
    it("should construct with width and height", () => {
        let level = new Level(4, 3);
        expect(level.width).to.equal(4);
        expect(level.height).to.equal(3);
    });
    it("should have empty maps initially", () => {
        let level = new Level(4, 3);
        expect(level.tileMap.size).to.equal(0);
        expect(level.entityMap.size).to.equal(0);
    });
});
