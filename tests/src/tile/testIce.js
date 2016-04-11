let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Ice", () => {
    it("should import correctly", () => {});
    it("should cause player to slide at 10 m/s", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            ===
            .....
            .IIP.
            .....
            .....
        `);
        expectations.expectPlayerAt(engine.gameState, 3, 1);
        engine.enqueuePlayerMovement("left");
        expectations.expectPlayerAt(engine.gameState, 2, 1);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 1);
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 0, 1);
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 0, 1);
    });

    it("should not allow player movement while sliding", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            ===
            .P....
            .I....
            .I....
            .I....
            .I....
            .I....
            ......
        `);
        expectations.expectPlayerAt(engine.gameState, 1, 0);
        engine.enqueuePlayerMovement("down");
        expectations.expectPlayerAt(engine.gameState, 1, 1);
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 2);
        engine.enqueuePlayerMovement("right");
        engine.enqueuePlayerMovement("right");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 3);
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 4);
        engine.enqueuePlayerMovement("up");
        engine.enqueuePlayerMovement("up");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 5);
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 1, 6);
    });

    it("should propel player around corners");
    it("should cause player direction to change");

    it("should cause monsters to slide");
    it("should cause blocks to slide");
    it("should propel over corners");
    it(": player should not slide with ice skates");
    it(": player can step over corners with ice skates but not back");
    it("should slide player before blocks"); // http://chipschallenge.wikia.com/wiki/Ice
    it(": player should be able to move off an ice corner at start");
    it(": monster should be able to move off an ice corner at start");
    it("should support cross checking"); // http://chipschallenge.wikia.com/wiki/Cross-checking
    it("should support boosting");
    it("should support slide delay");
    it("should support sliplist mechanics");
});
