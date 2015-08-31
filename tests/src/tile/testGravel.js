let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Gravel", () => {
    it("should import correctly", () => {});
    it("should block monsters", () => {
        expectations.expectTileToBlockMonsters("gravel");
    });
    it("should not block blocks", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            @ block
            g gravel
            ===
            P@g..
        `);
        engine.gameState.movePlayer("RRR");
        expectations.expectPlayerAt(engine.gameState, 3, 0);
    });
    it("should not block player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            g gravel
            ===
            Pggg.
        `);
        engine.gameState.movePlayer("RRRR");
        expectations.expectPlayerAt(engine.gameState, 4, 0);
    });
    it("should protect player when monster is next to it", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            b bug-west
            g gravel
            ===
            P.b..
            ===
            g....
            ===
            2 0
        `);
        expectations.withResetLevelStub(() => {
            engine.step().step().step().step().step();
            engine.gameState.movePlayer("RRR");
            expectations.expectPlayerAt(engine.gameState, 3, 0);
            expectations.expectNotLoss(engine.gameState);
        });
    });
});
