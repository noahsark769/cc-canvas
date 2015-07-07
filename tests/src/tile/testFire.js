let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Fire", () => {
    it.skip("should import correctly");
    it.skip("should be deadly to player");
    it.skip("should not kill player with fire boots");
    it.skip("should kill all monsters except fireball (excluding walkers and bugs)");
    it.skip(": walkers and bugs should treat fire as walls");
    it.skip("should not destroy blocks when moved on");
});
