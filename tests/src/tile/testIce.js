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
    it.skip("should import correctly");
    it.skip("should cause player to slide at 10 m/s");
    it.skip("should not allow player movement while sliding");
    it.skip("should cause monsters to slide");
    it.skip("should cause blocks to slide");
    it.skip("should propel over corners");
    it.skip(": player should not slide with ice skates");
    it.skip(": player can step over corners with ice skates but not back");
    it.skip("should slide player before blocks"); // http://chipschallenge.wikia.com/wiki/Ice
    it.skip(": player should be able to move off an ice corner at start");
    it.skip(": monster should be able to move off an ice corner at start");
    it.skip("should support cross checking"); // http://chipschallenge.wikia.com/wiki/Cross-checking
    it.skip("should support slide delay");
});
