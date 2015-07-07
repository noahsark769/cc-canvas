let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Toggle walls", () => {
    it.skip("should import correctly");
    it.skip(": open should let player, monsters, and blocks through");
    it.skip(": closed should block player, monsters, and blocks");
    it.skip(": green button should toggle all toggle wall tiles");
    it.skip("should support blocks flicked off");
    it.skip(": closed should be able to be stepped off by player");
});
