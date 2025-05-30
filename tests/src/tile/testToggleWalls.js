let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Toggle walls", () => {
    it("should import correctly", () => {});
    it(": open should let player, monsters, and blocks through", () => {
        expectations.expectTileNotToBlockPlayer("toggle_open");
        expectations.expectTileNotToBlockMonsters("toggle_open");
    });
    it(": closed should block player, monsters, and blocks", () => {
        expectations.expectTileToBlockMonsters("toggle_closed");
        expectations.expectTileToBlockBlocks("toggle_closed");
        expectations.expectTileToBlockPlayer("toggle_closed");
    });
    it(": green button should toggle all toggle wall tiles", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            ===
            PgTtT
        `);
        engine.enqueuePlayerMovement("r");
        engine.step();
        expectations.expectTileAt(engine.gameState, 2, 0, "toggle_open");
        expectations.expectTileAt(engine.gameState, 3, 0, "toggle_closed");
        expectations.expectTileAt(engine.gameState, 4, 0, "toggle_open");
    });
    it("should support block flicking", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            T toggle_closed
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
            ..T..
            .T.T.
            ..T..
            .....
        `);
        engine.gameState.movePlayer("ULDR");
        expectations.expectTileAt(engine.gameState, 2, 0, "block");
        expectations.expectTileAt(engine.gameState, 0, 2, "block");
        expectations.expectTileAt(engine.gameState, 4, 2, "block");
        expectations.expectTileAt(engine.gameState, 2, 4, "block");
    });
    it(": closed should be able to be stepped off by player", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            @ block
            ===
            P@g
            ===
            .t.
        `);
        engine.enqueuePlayerMovement("r");
        engine.step();
        engine.enqueuePlayerMovement("l");
        engine.step().step();
        expectations.expectPlayerAt(engine.gameState, 0, 0);
    });
    it("should never switch if starts on top of clone machine");
    it("should not switch if starts on lower level", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            @ block
            ===
            Pg..
            ===
            ..t.
        `);
        engine.enqueuePlayerMovement("r");
        engine.step();
        engine.enqueuePlayerMovement("r");
        engine.step().step();
        expect(engine.gameState.tileMap.get(2, 0, 2).name).to.equal("toggle_open");
        engine.enqueuePlayerMovement("r");
        engine.step().step();
        expectations.expectPlayerAt(engine.gameState, 3, 0);
    });
    it("should switch if starts on upper level but dropped to lower level by entity", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            @ block
            W wall
            ===
            Pt@g
            ===
            ..W.
        `);
        engine.enqueuePlayerMovement("r");
        engine.step();
        engine.enqueuePlayerMovement("r");
        engine.step().step();
        expect(engine.gameState.tileMap.get(1, 0, 2).name).to.equal("toggle_closed");
        engine.enqueuePlayerMovement("r");
        engine.step().step();
        expectations.expectPlayerAt(engine.gameState, 1, 0);
    });
    it(": on multiple green button press per turn, should switch if odd number pressed", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            @ block
            W wall
            F fireball-north
            ===
            gggtWP
            FFFWWW
            ===
            ......
            ......
            ===
            0 1
            1 1
            2 1
        `).step().step();
        expectations.expectTileAt(engine.gameState, 3, 0, "toggle_closed");
    });
    it(": on multiple green button press per turn, should not switch if even number pressed", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            T toggle_closed
            t toggle_open
            g button_green
            @ block
            W wall
            F fireball-north
            ===
            gg.tWP
            FFFWWW
            ===
            ......
            ......
            ===
            0 1
            1 1
            2 1
        `).step().step();
        expectations.expectTileAt(engine.gameState, 3, 0, "toggle_open");
    });
    it(": Button Smash Glitch"); // http://chipschallenge.wikia.com/wiki/Button_Smash_Glitch
    it(": scenario from http://chipschallenge.wikia.com/wiki/Button_Smash_Glitch");
});
