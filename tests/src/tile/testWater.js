let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Water", () => {
    it.skip("should import correctly");
    it.skip("should be deadly to player");
    it.skip("should not kill player with flippers");
    it.skip("should turn into dirt by block");
    it.skip("should kill all monsters except glider"); // bug can go around a thin wall run
});
