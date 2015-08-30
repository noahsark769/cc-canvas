let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Thin walls", () => {
    it("should import correctly", () => {});
    it("should block player movement off of same and opposing spaces", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            P player-south-normal
            J thin_lr
            ===
            P.].[.
            ......
            _.-.J.
            ......
        `);
        engine.gameState.movePlayer("RRR");
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        engine.gameState.movePlayer("DRUL");
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        engine.gameState.movePlayer("R");
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        engine.gameState.movePlayer("DRUL");
        expectations.expectPlayerAt(engine.gameState, 4, 0);
        engine.gameState.movePlayer("DDDR");
        expectations.expectPlayerAt(engine.gameState, 4, 2);
        engine.gameState.movePlayer("URDL");
        expectations.expectPlayerAt(engine.gameState, 5, 2);
        engine.gameState.movePlayer("DLU");
        expectations.expectPlayerAt(engine.gameState, 4, 3);
        engine.gameState.movePlayer("LLUU");
        expectations.expectPlayerAt(engine.gameState, 2, 2);
        engine.gameState.movePlayer("RULD");
        expectations.expectPlayerAt(engine.gameState, 2, 1);
        engine.gameState.movePlayer("LLDD");
        expectations.expectPlayerAt(engine.gameState, 0, 2);
        engine.gameState.movePlayer("RDLUU");
        expectations.expectPlayerAt(engine.gameState, 0, 3);
    });
    it("should block monster movement", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            F fireball-east
            P player-south-normal
            J thin_lr
            ===
            PF].[.
            .J_]..
            _].J-.
            .....[
            ===
            ......
            ......
            ......
            ......
            ===
            1 0
        `).step();
        expectations.expectEntityAtCoordSequence(engine, "fireball", new Coordinate(1, 0), "rdrdldllrrrrurduuuldrddu");

        engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            B bug-west
            P player-south-normal
            J thin_lr
            ===
            P.[..J
            --....
            _.][..
            -.][JB
            ===
            ......
            ......
            ......
            ......
            ===
            5 3
        `).step();
        expectations.expectEntityAtCoordSequence(engine, "bug", new Coordinate(5, 3), "uldluulddllrulurrurrrldrdd");
    }); // bug can go around a thin wall run
    it("should block blocks (from both sides)", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            J thin_lr
            @ block
            P player-south-normal
            ===
            ........
            ........
            P@]...@.
            ......-.
            ........
            .@[..._.
            ......@.
            ........
            .J@.....
            ........
            ........
        `);
        expectations.movePlayerAndExpectAt(engine.gameState, "RRRR", 1, 2); // push the block into the thin wall
        expectations.movePlayerAndExpectAt(engine.gameState, "DRULURURDRDLLLLL", 4, 2); // move the block to the other side
        expectations.movePlayerAndExpectAt(engine.gameState, "RURDDDDD", 6, 1); // push down into thin wall
        expectations.movePlayerAndExpectAt(engine.gameState, "RDLULDLDRDRUUUUUUU", 6, 4); // push around and up into thin wall
        expectations.movePlayerAndExpectAt(engine.gameState, "LLLLLLDRRRR", 0, 5); // push middle left block into thin wall
        expectations.movePlayerAndExpectAt(engine.gameState, "DRULURURDRDLLLLL", 3, 5); // push middle left block around to other side
        expectations.movePlayerAndExpectAt(engine.gameState, "DDRRRUUUUU", 6, 7); // push lower right block into thin wall
        expectations.movePlayerAndExpectAt(engine.gameState, "RULDLULURURDDDDDD", 6, 4); // push up and around to other side
        expectations.movePlayerAndExpectAt(engine.gameState, "LDDDDLLLLLL", 3, 8); // push lower block into wall from right
        expectations.movePlayerAndExpectAt(engine.gameState, "ULDRDLDLUUUU", 1, 10); // push into wall from bottom
        expectations.movePlayerAndExpectAt(engine.gameState, "LURDRUURULULDDDDDD", 1, 7); // push into crook of wall
    });
    it("should support block flicking (one side thin walls)", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            J thin_lr
            @ block
            P player-south-normal
            ===
            .....
            ..@..
            .@P@.
            ..@..
            .....
            ===
            .....
            .._..
            .].[.
            ..-..
            .....
        `);
        engine.gameState.movePlayer("ULDR");
        expectations.expectTileAt(engine.gameState, 2, 0, "block");
        expectations.expectTileAt(engine.gameState, 0, 2, "block");
        expectations.expectTileAt(engine.gameState, 4, 2, "block");
        expectations.expectTileAt(engine.gameState, 2, 4, "block");
    });
    it("should support block flicking (L-shaped thin walls)", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            - thin_top
            ] thin_right
            [ thin_left
            _ thin_bottom
            J thin_lr
            @ block
            P player-south-normal
            ===
            .....
            ..@..
            ..P..
            ..@..
            .....
            ===
            .....
            ..J..
            .....
            ..J..
            .....
        `);
        engine.gameState.movePlayer("URDL");
        expectations.expectTileAt(engine.gameState, 2, 0, "block");
        expectations.expectTileAt(engine.gameState, 1, 3, "block");
    });
});
