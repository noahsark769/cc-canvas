let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { ForceLeft, ForceRight, ForceUp, ForceDown } = reqlib("/src/tile/Force");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");
let { Direction } = reqlib("/src/core/2d/directions");

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

    it("should not slide player with force boots", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            < force_left
            _ force_down
            > force_right
            ^ force_up
            B boots_force
            ===
            ...B.
            ._<P.
            .>>^
            .....
        `);
        expectations.expectPlayerAt(engine.gameState, 3, 1);
        function enqueueAndStep(movement) {
            engine.enqueuePlayerMovement(movement);
            engine.step();
        }
        function enqueueControlString(control) {
            for (let letter of control) {
                enqueueAndStep(letter);
            }
        }
        enqueueControlString("udluldddruurdlluu");
        expectations.expectPlayerAt(engine.gameState, 1, 0);
    });

    let expectEntityToSlide = function(entityName) {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            I ice
            < force_left
            > force_right
            ^ force_up
            _ force_down
            P player-south-normal
            B ${entityName}-west
            W wall
            ===
            P._<<BW
            .._.<W.
            W.>>^..
            W.W....
            W.W....
            WWW....
            ===
            .......
            .......
            .......
            .......
            .......
            .......
            ===
            5 0
        `);

        let name = entityName;
        let tickAndExpectEntityAt = function(x, y, dir, useMonsterList = false) {
            engine.tick();
            expectations.expectEntityAt(engine.gameState, x, y, name);
            // todo: this next line is ugly
            let list;
            if (useMonsterList) {
                list = engine.gameState.monsterList;
            } else {
                list = engine.gameState.slipList;
            }
            let actualDirection = list.asArray()[0].direction;
            expect(actualDirection.equals(dir), "Direction " + actualDirection + " did not equal expected direction " + dir).to.be.true;
        };

        expectations.expectEntityAt(engine.gameState, 5, 0, name);

        engine.step();
        if (["blob", "teeth"].indexOf(entityName) !== -1) {
            engine.step();
        }
        engine.tick();
        expectations.expectEntityAt(engine.gameState, 4, 0, name);
        // todo: this next line is ugly
        let actualDirection = engine.gameState.slipList.asArray()[0].direction;
        expect(actualDirection.isWest(), "Direction " + actualDirection + " did not equal expected direction west").to.be.true;
        tickAndExpectEntityAt(3, 0, Direction.west());
        tickAndExpectEntityAt(2, 0, Direction.south());
        tickAndExpectEntityAt(2, 1, Direction.south());
        tickAndExpectEntityAt(2, 2, Direction.east());
        tickAndExpectEntityAt(3, 2, Direction.east());
        tickAndExpectEntityAt(4, 2, Direction.north());
        tickAndExpectEntityAt(4, 1, Direction.west());
        tickAndExpectEntityAt(3, 1, Direction.west(), true);
    };

    for (let entity of ["bug", "blob", "ball", "fireball", "glider", "paramecium", "teeth", "walker"]) {
        it("should cause " + entity + " to slide", function () {
            expectEntityToSlide(entity);
        });
    }

    it("should not bounce player", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            > force_right
            P player-south-normal
            W wall
            ===
            P>>W...
            .......
        `);
        expectations.expectPlayerAt(engine.gameState, 0, 0);
        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 2, 0, "player-east-normal");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 2, 0, "player-east-normal");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 2, 0, "player-east-normal");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 2, 0, "player-east-normal");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 2, 0, "player-east-normal");
    });

    it("should direct player the direction of the force at a wall", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            ^ force_up
            P player-south-normal
            W wall
            ===
            ...W...
            ..P^...
        `);
        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.tick();
        engine.tick();
        expectations.expectTileAt(engine.gameState, 3, 1, "player-north-normal");
        engine.tick();
        expectations.expectTileAt(engine.gameState, 3, 1, "player-north-normal");
        engine.tick();
        expectations.expectTileAt(engine.gameState, 3, 1, "player-north-normal");
        engine.tick();
        expectations.expectTileAt(engine.gameState, 3, 1, "player-north-normal");
        engine.tick();
        expectations.expectTileAt(engine.gameState, 3, 1, "player-north-normal");
    })

    it.skip("should cause blocks to slide");

    it.skip("should let player override if involuntary", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            > force_right
            P player-south-normal
            W wall
            ===
            P>>>>.
            ......
        `);
        engine.enqueuePlayerMovement("right");
        engine.tick();
        engine.enqueuePlayerMovement("down");
        engine.tick();
        engine.enqueuePlayerMovement("down");
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 1);    
    });

    it.skip("should not let player override backwards");
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
