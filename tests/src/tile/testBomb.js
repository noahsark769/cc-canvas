let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Bomb", () => {
    it("should import correctly", () => {});
    it("should kill player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ bomb
            P player-south-normal
            ===
            P....
            ...@.
            .....
        `);
        let stub = sinon.stub(engine, "resetCurrentLevel");
        engine.gameState.movePlayer("DRRR");
        expecations.expectLoss(engine.gameState);
        stub.restore();
    });
    it("should destroy and be destroyed by blocks", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ bomb
            B block
            P player-south-normal
            ===
            PB.@.
            .B.@.
            .B.@.
        `);
        engine.gameState.movePlayer("RRLLDRRLLDRRLL");
        expecations.expectTileAt(engine.gameState, 3, 0, "floor");
        expecations.expectTileAt(engine.gameState, 3, 1, "floor");
        expecations.expectTileAt(engine.gameState, 3, 2, "floor");
        expecations.expectTileAt(engine.gameState, 2, 0, "floor");
        expecations.expectTileAt(engine.gameState, 2, 1, "floor");
        expecations.expectTileAt(engine.gameState, 2, 2, "floor");
    });
    it("should destroy and be destroyed by monsters", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ block_mystery_fake
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
        expect(engine.gameState.monsterList.size).to.equal(0);
        expectations.expectTileAt(engine.gameState, 4, 0, "floor");
        expectations.expectTileAt(engine.gameState, 4, 2, "floor");
        expectations.expectTileAt(engine.gameState, 4, 4, "floor");
        expectations.expectTileAt(engine.gameState, 4, 6, "floor");
        expectations.expectTileAt(engine.gameState, 4, 8, "floor");
        expectations.expectTileAt(engine.gameState, 4, 10, "floor");
        expectations.expectTileAt(engine.gameState, 4, 12, "floor");
        expectations.expectTileAt(engine.gameState, 4, 14, "floor");
    });
});
