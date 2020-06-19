let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");
let { Teleport } = reqlib("/src/tile/Teleport");

describe("Teleport", () => {
    it("should import correctly", () => {});

    it("should work in RWRO for player", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            T teleport
            ===
            .T..T.
            .T..T.
            .T..TP
        `);
        engine.enqueuePlayerMovement("left");
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 0, 2);

        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 5, 1);
        engine.enqueuePlayerMovement("left");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 0, 1);
        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 5, 0);
        engine.enqueuePlayerMovement("left");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 0, 0);
        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 5, 2);
    });

    it(": vertical/horizontal movements", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            T teleport
            ===
            ......
            .T..T.
            ......
            .T..TP
            ......
        `);
        let engineExpectations = expectations.engine(engine);

        engineExpectations.stepTickAWhileAndExpectPlayerAt("dlu", 1, 2);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("lddru", 4, 0);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("lddru", 1, 0);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("lddru", 4, 2);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("d", 1, 4);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("luurd", 4, 2);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("luurd", 1, 2);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("luurd", 4, 4);
    });

    it(": one teleport then another", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            T teleport
            ===
            ......
            ....T.
            ......
            .TT.TP
            ......
        `);
        let engineExpectations = expectations.engine(engine);
        engineExpectations.stepTickAWhileAndExpectPlayerAt("l", 3, 1);
    });

    it.skip("should work in RWRO for blocks");
    it.skip("should work in RWRO for monsters");
    it.skip("should wrap to next teleport if move is blocked");
    it.skip("should function as ice, with bouncing, for player/blocks if all other teleports are blocked");
    it.skip("should function as ice, with bouncing, for player/blocks if it's the only teleport");
    it.skip(": Pushing a block into a teleport, then at the next second a bug comes in on a force floor to block it");
    it.skip("should trap monsters instead of bouncing back on blocked teleport");
    it.skip("should function as ice always when revealed from the lower layer");
    it.skip("should support partial posting");
    it.skip("should support Teleport Skip Glitch"); // http://chipschallenge.wikia.com/wiki/Teleport_Skip_Glitch
    it.skip("should support Convergence Glitch"); // http://chipschallenge.wikia.com/wiki/Convergence_Glitch
});
