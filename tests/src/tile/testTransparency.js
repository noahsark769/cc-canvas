let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Transparency mechanics", () => {
    it.skip("should support transparent boots and keys");
    it.skip("should not make buttons transparent");
    it.skip("should look at bottom layer to determine player access");
    it.skip("should look at top layer to determine monster access");
    it.skip(": fire under block should kill player");
    it.skip(": chips under blocks should be collectable");
    it.skip(": clone machine should block monsters, blocks, and player on either layer");
    it.skip(": monsters should die on reaching player if player is over desctructive obstacle");
    it.skip(": blocks should erase any lower layer with upper layers other than floor, water, bombs");
    it.skip(": sliding blocks should kill player regardless of tile under start, except clone machine");
    it.skip(": escape on lower layer should take immediate effect");
    it.skip(": unconnected trap on the lower layer should take immediate effect");
    it.skip(": connected trap on the lower layer should NOT take immediate effect");
    it.skip(": normal tiles should not activate after being revealed by player");
    it.skip(": player should be able to reveal another player tile");
    it.skip(": player should not be active if on the bottom layer");
    it.skip(": non-existance glitch for player above a bomb hit by a monster?");
    it.skip(": lower level tiles should be erased by gliders and player swimming over them");
    it.skip(": player should collect key under water after pushing block onto it");
    it.skip(": player should be able to collect items hidden under dirt");
    it.skip("should support real exit above clone machine that actually blocks player");
    it.skip(": player that pushes block over hidden water should be killed by water on next push");
    it.skip(": player should be killed by monster hidden under block");
    it.skip("should treat bottom level with something, top level empty as if bottom tile were on top level");
});
