let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { ForceLeft, ForceRight, ForceUp, ForceDown } = reqlib("/src/tile/Force");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Force floors", () => {
    it("should import correctly", () => {});
    it("should cause player to slide at 10 m/s", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            < force_left
            _ force_down
            > force_right
            ^ force_up
            ===
            .....
            ._<P.
            .>>^
            .....
        `);
        expectations.expectPlayerAt(engine.gameState, 3, 1);
        engine.enqueuePlayerMovement("left");
        expectations.expectPlayerAt(engine.gameState, 2, 1);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 1);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 2);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 2);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 3, 2);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 3, 1);
    });
    it.skip("should not slide player with force boots");
    it.skip("should cause monsters to slide");
    it.skip("should cause blocks to slide");
    it.skip("should let player override if involuntary");
    it.skip("should let player override in ANY direction if sliding from ice");
    it.skip("should let player override if stuck at wall");
    it.skip(": overriding the same way as sliding should have no effect");
    it.skip("should support slide delay");
    it.skip("should support headbanger rule"); // http://chipschallenge.wikia.com/wiki/Headbanger_Rule
    describe("(random force floor tile)", () => {
        it.skip("should not slide player with force boots");
        it.skip("should move player");
        it.skip("should move blocks");
    });
});
