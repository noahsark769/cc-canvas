let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Blue walls", () => {
    it.skip("should import correctly");

    describe("(real)", () => {
        it.skip("should turn real when pressed");
        it.skip("should block player, blocks, and monsters");
    });
    describe("(fake)", () => {
        it.skip("should be replaced by player");
        it.skip("should block player, blocks, and monsters");
    });
});
