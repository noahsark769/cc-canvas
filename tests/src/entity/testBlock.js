let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Block", () => {
    it("should import correctly");
    it("should let player push", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            ===
            .....
            ..BP.
            .....
            .....
        `);
        expectations.expectTileAt(engine.gameState, 2, 1, "block");
        engine.movePlayer("L");
        expectations.expectTileAt(engine.gameState, 1, 1, "block");
        engine.movePlayer("ULD");
        expectations.expectTileAt(engine.gameState, 1, 2, "block");
        engine.movePlayer("LDR");
        expectations.expectTileAt(engine.gameState, 2, 2, "block");
        engine.movePlayer("DRU");
        expectations.expectTileAt(engine.gameState, 2, 1, "block");
        engine.movePlayer("RUL");
        expectations.expectTileAt(engine.gameState, 1, 1, "block");
        engine.movePlayer("LL");
        expectations.expectTileAt(engine.gameState, 0, 1, "block");
        engine.movePlayer("DLUUU");
        expectations.expectTileAt(engine.gameState, 0, 0, "block");
    });
    it("should block monsters", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            @ block
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
        expectations.expectEntityAt(engine.gameState, 5, 4, "glider");
        expectations.expectEntityAt(engine.gameState, 5, 6, "glider");
        expectations.expectEntityAt(engine.gameState, 5, 8, "ball");
        expectations.expectEntityAt(engine.gameState, 5, 10, "walker");
        expectations.expectEntityAt(engine.gameState, 5, 12, "blob");
        expectations.expectEntityAt(engine.gameState, 5, 14, "teeth");
    });
    it("should block other blocks", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            ===
            .....
            .BBP.
            .....
            .....
        `);
        engine.gameState.movePlayer("LLLL");
        expectations.expectPlayerAt(engine.gameState, 3, 1);
        engine.gameState.movePlayer("ULDRDLDLUUUUUU"); // push under other block
        expectations.expectPlayerAt(engine.gameState, 1, 3);
        engine.gameState.movePlayer("LUUURDDDDD");
        expectations.expectPlayerAt(engine.gameState, 1, 0);
        engine.gameState.movePlayer("LDRURDLLDRRRRRRR");
        expectations.expectPlayerAt(engine.gameState, 0, 1);
    });
    it("should immediately reveal fire on lower level", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            x fire
            ===
            ..BP.
            ===
            ..x..
        `);
        sinon.stub(engine, "resetCurrentLevel");
        engine.gameState.movePlayer("L");
        expectations.expectLoss(engine.gameState);
    });
    it("should immediately reveal chips on lower level", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            C chip
            ===
            ..BP.
            ===
            ..C..
        `);
        expect(engine.gameState.chipsLeft).to.equal(1);
        engine.gameState.movePlayer("L");
        expect(engine.gameState.chipsLeft).to.equal(0);
    });
    it.skip("should hold down brown buttons");
    it.skip("should should only press green and blue buttons once");
    it.skip("should destroy bombs");
    it.skip("should be able to be rammed"); // http://chipschallenge.wikia.com/wiki/Ram
});
