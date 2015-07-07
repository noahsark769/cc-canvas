let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Block", () => {
    it.skip("should import correctly");
    it.skip("should let player push");
    it.skip("should block monsters");
    it.skip("should block other blocks");
    it.skip("should hold down brown buttons");
    it.skip("should should only press green and blue buttons once");
    it.skip("should destroy bombs");
    it.skip("should be able to be rammed"); // http://chipschallenge.wikia.com/wiki/Ram
});
