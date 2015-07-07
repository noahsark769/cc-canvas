let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Cement", () => {
    it.skip("should import correctly");
    it.skip("should block monsters");
    it.skip("should block blocks");
    it.skip("should turn into wall when stepped on by player");
    it.skip("should not take effect if revealed by player on lower layer");
});
