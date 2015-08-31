let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Invisible wall", () => {
    it("should import correctly", () => {});

    describe("(appearing)", () => {
        it("should appear when pressed", () => {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                P player-south-normal
                B wall_invisible_appearing
                ===
                ..B..
                ..BP.
                ..B..
                .....
            `);
            engine.gameState.movePlayer("LLLLULLLLDDLLLLDLLURRRURRRURRR");
            expectations.expectPlayerAt(engine.gameState, 1, 0);
            expectations.expectTileAt(engine.gameState, 2, 0, "wall");
            expectations.expectTileAt(engine.gameState, 2, 1, "wall");
            expectations.expectTileAt(engine.gameState, 2, 2, "wall");
        });
        it("should block monsters", () => {
            expectations.expectTileToBlockMonsters("wall_invisible_appearing");
        });
        it("should block blocks", () => {
            expectations.expectTileToBlockBlocks("wall_invisible_appearing");
        });
    });
    describe("(not appearing)", () => {
        it("should block player", () => {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                P player-south-normal
                B wall_invisible
                ===
                ..B..
                ..BP.
                ..B..
                .....
            `);
            engine.gameState.movePlayer("LLLLULLLLDDLLLLDLLURRRURRRURRR");
            expectations.expectPlayerAt(engine.gameState, 1, 0);
            expectations.expectTileAt(engine.gameState, 2, 0, "wall_invisible");
            expectations.expectTileAt(engine.gameState, 2, 1, "wall_invisible");
            expectations.expectTileAt(engine.gameState, 2, 2, "wall_invisible");
        });
        it("should block monsters", () => {
            expectations.expectTileToBlockMonsters("wall_invisible");
        });
        it("should block blocks", () => {
            expectations.expectTileToBlockBlocks("wall_invisible");
        });
    });
});
