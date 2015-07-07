let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Teleport", () => {
    it.skip("should import correctly");
    it.skip("should work in RWRO for player");
    it.skip("should work in RWRO for blocks");
    it.skip("should work in RWRO for monsters");
    it.skip("should wrap to next teleport if move is blocked");
    it.skip("should function as ice, with bouncing, for player/blocks if all other teleports are blocked");
    it.skip("should function as ice, with bouncing, for player/blocks if it's the only teleport");
    it.skip("should trap monsters instead of bouncing back on blocked teleport");
    it.skip("should function as ice always when revealed from the lower layer");
    it.skip("should support partial posting");
    it.skip("should support Teleport Skip Glitch"); // http://chipschallenge.wikia.com/wiki/Teleport_Skip_Glitch
    it.skip("should support Convergence Glitch"); // http://chipschallenge.wikia.com/wiki/Convergence_Glitch
});
