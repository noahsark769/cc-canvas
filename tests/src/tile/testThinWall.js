let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Thin walls", () => {
    it("should import correctly", () => {});
    it("should block player movement off of same and opposing spaces", () => {
        let engine = GameEngine.fromSchematic(`
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
        let engine = GameEngine.fromSchematic(`
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
            ......
        `);
        expectations.expectEntityAtCoordSequence(engine, "firball", new Coordinate(1, 0), "rdruddldllrrrrruuuldr");

        engine = GameEngine.fromSchematic(`
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
        `);
        expectations.expectEntityAtCoordSequence(engine, "bug", new Coordinate(5, 3), "uldluulddllrulurrurrrldrdd");
    }); // bug can go around a thin wall run
    it.skip("should block blocks (from both sides)");
    it.skip("should support block flicking");
});
