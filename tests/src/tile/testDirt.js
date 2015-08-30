let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Dirt", () => {
    it("should import correctly", () => {});
    it("should block monsters", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ dirt
            P player-south-normal
            B bug-west
            p paramecium-west
            F fireball-west
            G glider-west
            O ball-west
            w walker-west
            b blob-west
            T teeth-west
            W wall
            ===
            P...@BW
            WWWWWWW
            ....@pW
            WWWWWWW
            ....@FW
            WWWWWWW
            ....@GW
            WWWWWWW
            ....@OW
            WWWWWWW
            ....@wW
            WWWWWWW
            ....@bW
            WWWWWWW
            ....@TW
            WWWWWWW
            ===
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            .......
            ===
            5 0
            5 2
            5 4
            5 6
            5 8
            5 10
            5 12
            5 14
        `).step().step().step().step().step().step().step().step().step().step().step().step();
        expectations.expectEntityAt(engine.gameState, 5, 0, "bug");
        expectations.expectEntityAt(engine.gameState, 5, 2, "paramecium");
        expectations.expectEntityAt(engine.gameState, 5, 4, "fireball");
        expectations.expectEntityAt(engine.gameState, 5, 6, "glider");
        expectations.expectEntityAt(engine.gameState, 5, 8, "ball");
        expectations.expectEntityAt(engine.gameState, 5, 10, "walker");
        expectations.expectEntityAt(engine.gameState, 5, 12, "blob");
        expectations.expectEntityAt(engine.gameState, 5, 14, "teeth");
    });
    it("should be cleared by player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B dirt
            ===
            ..B..
            ..BP.
            ..B..
            .....
        `);
        engine.gameState.movePlayer("ULDDR");
        expectations.expectPlayerAt(engine.gameState, 3, 2);
        expectations.expectTileAt(engine.gameState, 2, 0, "floor");
        expectations.expectTileAt(engine.gameState, 2, 1, "floor");
        expectations.expectTileAt(engine.gameState, 2, 2, "floor");
    });
    it("should block blocks", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ block
            B dirt
            P player-south-normal
            ===
            P...B.
            ...@B.
            ....B.
            ....B.
        `);
        engine.gameState.movePlayer("RRDRRRRRURDLDRRRURDLDRRR");
        expectations.expectPlayerAt(engine.gameState, 2, 3);
        expectations.expectTileAt(engine.gameState, 3, 3, "block");
        expectations.expectTileAt(engine.gameState, 4, 2, "dirt");
    });
});
