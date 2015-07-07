let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Thin walls", () => {
    it.skip("should import correctly");
    it.skip("should block player movement off of same space");
    it.skip("should block player movement off of opposing space");
    it.skip("should block monster movement"); // bug can go around a thin wall run
    it.skip("should block blocks (from both sides)");
    it.skip("should support block flicking");
});
