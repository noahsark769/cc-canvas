let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Tank", () => {
    it.skip("should import correctly");
    it.skip("should move in straight line to an obstacle when blue button is pressed");
    it.skip("should reverse direction when sliding on ice");
    it.skip("should not reverse direction while sliding on ice");
    it.skip("should not reverse direction while sliding on force floors");
    it.skip(": Tank Top glitch"); // http://chipschallenge.wikia.com/wiki/Tank_Top_Glitch
    it.skip(": Frankenstein glitch"); // http://chipschallenge.wikia.com/wiki/Frankenstein_Glitch
    it.skip("should be released from trap when brown button is pressed before blue button");

    describe("(moving times)", () => {
        it.skip("should reverse in the same turn if already in motion");
        it.skip("should wait [1] if reversed on the first turn of a level");
        it.skip("should wait [1] if stationary and blue button touched on even tick");
        it.skip("should not if stationary and blue button touched on odd tick");
        it.skip(": only tanks ahead in monster order should reverse when blue button touched by monster");
    });
});
