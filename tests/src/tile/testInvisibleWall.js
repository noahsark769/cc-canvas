let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Invisible wall", () => {
    it.skip("should import correctly");
    describe("(appearing)", () => {
        it.skip("should block monsters, blocks, and player");
        it.skip("should appear when pushed");
    });
    describe("(invisible)", () => {
        it.skip("should block monsters, blocks, and player");
        it.skip("should not when pushed");
    });
});
