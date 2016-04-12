let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");
let { Direction } = reqlib("/src/core/2d/directions");

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

    it("should propel player around corners", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            ] ice_ur
            ===
            ......
            ./IIP]
            .I..I.
            .I..I.
            .I..I.
            .>II^.
            ......
        `);

        let tickAndExpectPlayerAt = function(x, y) {
            engine.tick();
            expectations.expectPlayerAt(engine.gameState, x, y);
        };
        engine.enqueuePlayerMovement("left");
        expectations.expectPlayerAt(engine.gameState, 3, 1);
        tickAndExpectPlayerAt(2, 1);
        tickAndExpectPlayerAt(1, 1);
        tickAndExpectPlayerAt(1, 2);
        tickAndExpectPlayerAt(1, 3);
        tickAndExpectPlayerAt(1, 4);
        tickAndExpectPlayerAt(1, 5);
        tickAndExpectPlayerAt(2, 5);
        tickAndExpectPlayerAt(3, 5);
        tickAndExpectPlayerAt(4, 5);
        tickAndExpectPlayerAt(4, 4);
        tickAndExpectPlayerAt(4, 3);
        tickAndExpectPlayerAt(4, 2);
        tickAndExpectPlayerAt(4, 1);

        tickAndExpectPlayerAt(4, 1);
        tickAndExpectPlayerAt(4, 1);
        tickAndExpectPlayerAt(4, 1);
        engine.enqueuePlayerMovement("right");
        tickAndExpectPlayerAt(5, 1);
        tickAndExpectPlayerAt(5, 2);
    });

    it("should change player direction", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            ] ice_ur
            ===
            ......
            ./IIP]
            .I..I.
            .I..I.
            .I..I.
            .>II^.
            ......
        `);

        function expectPlayerDirectionToBe(dir) {
            expect(engine.gameState.player.direction.equals(dir)).to.be.true;
        }

        engine.enqueuePlayerMovement("left");
        engine.tick();
        expectPlayerDirectionToBe(Direction.west());
        engine.tick();
        // should be south, on corner
        expectPlayerDirectionToBe(Direction.south());
        engine.tick();
        expectPlayerDirectionToBe(Direction.south());
        engine.tick().tick().tick();
        expectPlayerDirectionToBe(Direction.east());
        engine.tick();
        expectPlayerDirectionToBe(Direction.east());
        engine.tick().tick();
        expectPlayerDirectionToBe(Direction.north());
        engine.tick().tick();
        expectPlayerDirectionToBe(Direction.north());
    });
    it(": ice corners should block player", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            ] ice_ur
            ===
            .......
            ./IIP].
            .I..I..
            .I..I..
            .I..I..
            .>II^..
            .......
        `);
        engine.gameState.movePlayer("ulllddddddd");
        expectations.expectPlayerAt(engine.gameState, 1, 0);
        engine.gameState.movePlayer("ldrrrrrrrrrr");
        expectations.expectPlayerAt(engine.gameState, 0, 1);
        engine.gameState.movePlayer("ddddrrrrrrrr");
        expectations.expectPlayerAt(engine.gameState, 0, 5);
        engine.gameState.movePlayer("druuuuuuuuuu");
        expectations.expectPlayerAt(engine.gameState, 1, 6);
        engine.gameState.movePlayer("rrruuuuuuuuu");
        expectations.expectPlayerAt(engine.gameState, 4, 6);
        engine.gameState.movePlayer("rruuuuullllll");
        expectations.expectPlayerAt(engine.gameState, 6, 1);
        engine.gameState.movePlayer("ulddddddddddd");
        expectations.expectPlayerAt(engine.gameState, 5, 0);
    });

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
