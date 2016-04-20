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

    it(": player should bounce off walls after sliding", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            W wall
            ===
            ......
            WIIIP.
            ......
            ......
            ......
            ......
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
        tickAndExpectPlayerAt(2, 1);
        tickAndExpectPlayerAt(3, 1);
        tickAndExpectPlayerAt(4, 1);
        tickAndExpectPlayerAt(4, 1);
        tickAndExpectPlayerAt(4, 1);
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

    let expectEntityToSlide = function(entityName) {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            < ice_ur
            P player-south-normal
            B ${entityName}-west
            W wall
            ===
            P./IIBW
            ./II<W.
            W.>I^..
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
        tickAndExpectEntityAt(3, 1, Direction.west());
        tickAndExpectEntityAt(2, 1, Direction.west());
        tickAndExpectEntityAt(1, 1, Direction.south());
        tickAndExpectEntityAt(1, 2, Direction.south(), true);
    };

    for (let entity of ["bug", "blob", "ball", "fireball", "glider", "paramecium", "teeth", "walker"]) {
        it("should cause " + entity + " to slide", function () {
            expectEntityToSlide(entity);
        });
    }

    it("should cause blocks to slide", function () {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            < ice_ur
            P player-south-normal
            B block
            W wall
            ===
            ../IIBP
            ./II<W.
            W.>I^..
            W.W....
            W.W....
            WWW....
        `);

        let tickAndExpectBlockAt = function(x, y) {
            engine.tick();
            expectations.expectTileAt(engine.gameState, x, y, "block");
        };

        engine.enqueuePlayerMovement("left");
        expectations.expectTileAt(engine.gameState, 4, 0, "block");
        tickAndExpectBlockAt(3, 0);
        tickAndExpectBlockAt(2, 0);
        tickAndExpectBlockAt(2, 1);
        tickAndExpectBlockAt(2, 2);
        tickAndExpectBlockAt(3, 2);
        tickAndExpectBlockAt(4, 2);
        tickAndExpectBlockAt(4, 1);
        tickAndExpectBlockAt(3, 1);
        tickAndExpectBlockAt(2, 1);
        tickAndExpectBlockAt(1, 1);
        tickAndExpectBlockAt(1, 2);
    });

    it(": block should bounce off walls when sliding", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            < ice_ur
            P player-south-normal
            B block
            W wall
            ===
            WIIIIBP
            .......
            .......
            .......
            .......
            .......
        `);

        let tickAndExpectBlockAt = function(x, y) {
            engine.tick();
            expectations.expectTileAt(engine.gameState, x, y, "block");
        };

        engine.enqueuePlayerMovement("left");
        expectations.expectTileAt(engine.gameState, 4, 0, "block");
        tickAndExpectBlockAt(3, 0);
        tickAndExpectBlockAt(2, 0);
        tickAndExpectBlockAt(1, 0);
        tickAndExpectBlockAt(2, 0);
        tickAndExpectBlockAt(3, 0);
        tickAndExpectBlockAt(4, 0);
    });

    it(": player should be killed by sliding blocks", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            I ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            < ice_ur
            P player-south-normal
            B block
            ===
            .../IBP
            ...>II^
        `);

        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("right");
        engine.tick().tick().tick().tick().tick().tick()
        expect(engine.gameState.isOver).to.be.true;
        expect(engine.gameState.isLoss).to.be.true;
    });

    it(": player should not slide with ice skates", function() {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            I ice
            B boots_ice
            / ice_ul
            > ice_ll
            ^ ice_lr
            ] ice_ur
            ===
            ....I.
            ./IIP]
            .II.I.
            .I..I.
            .I..I.
            .>II^.
            ......
        `);
        function enqueueAndStep(movement) {
            engine.enqueuePlayerMovement(movement);
            engine.step();
        }
        function enqueueControlString(control) {
            for (let letter of control) {
                enqueueAndStep(letter);
            }
        }
        engine.enqueuePlayerMovement("up");
        engine.tick();
        enqueueControlString("dludduluddlllllrruldrddllrrdlurrrruull");
        expectations.expectPlayerAt(engine.gameState, 2, 2);
    });

    it(": player can step over corners with ice skates but not back");
    it("should slide player before blocks"); // http://chipschallenge.wikia.com/wiki/Ice
    it(": player should be able to move off an ice corner at start");
    it(": monster should be able to move off an ice corner at start");
    it("should support cross checking"); // http://chipschallenge.wikia.com/wiki/Cross-checking
    it("should support boosting");
    it("should support slide delay");
    it("should support sliplist mechanics");
    it("should support spring slide");
});
