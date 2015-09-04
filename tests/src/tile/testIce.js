let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Ice", () => {
    it("should import correctly", () => {});
    it("should cause player to slide at 10 m/s", () => {
        let engine = GameEngne.fromTestSchematic(`
            
        `);
    });
    it("should not allow player movement while sliding");
    it("should cause monsters to slide");
    it("should cause blocks to slide");
    it("should propel over corners");
    it(": player should not slide with ice skates");
    it(": player can step over corners with ice skates but not back");
    it("should slide player before blocks"); // http://chipschallenge.wikia.com/wiki/Ice
    it(": player should be able to move off an ice corner at start");
    it(": monster should be able to move off an ice corner at start");
    it("should support cross checking"); // http://chipschallenge.wikia.com/wiki/Cross-checking
    it("should support slide delay");
    it("should support sliplist mechanics");
});
