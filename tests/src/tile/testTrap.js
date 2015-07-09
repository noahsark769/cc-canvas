let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Bear trap", () => {
    it.skip("should import correctly");
    it.skip("should trap and release monsters");
    it.skip("should trap and release blocks");
    it.skip("should trap and release player");
    it.skip("should trap player, monster when unconnected");
    it.skip("should trap block when unconnected");
    it.skip("should be released by multiple brown buttons");
    it.skip("should be erased by monsters on the lower layer");
    it.skip("should trap monsters on lower layer if unconnected OR connected");
    it.skip("should trap player on lower layer if unconnected");
    it.skip("should trap blocks on lower layer if unconnected");
    it.skip("should not trap blocks on lower layer if connected");
    it.skip("should not trap player on lower layer if connected");
    it.skip(": a block that slides into a connected trap should slide for one more step after trap is released");
    it.skip(": scenario from http://chipschallenge.wikia.com/wiki/Trap");
    it.skip(": Controller Glitch");
    it.skip(": Button Smash Glitch"); // http://chipschallenge.wikia.com/wiki/Button_Smash_Glitch
});
