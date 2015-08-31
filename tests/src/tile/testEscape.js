let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");

let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Escape", () => {
    it("should import correctly", () => {});
    it("should end game on step", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            E escape
            ===
            ...
            E.P
            ...
        `);
        expect(state.isWin).to.be.false;
        expect(state.isOver).to.be.false;
        state.movePlayer("LL");
        expect(state.isWin).to.be.true;
        expect(state.isOver).to.be.true;
        expect(state.isLoss).to.be.false;
    });
    it("should not block blocks", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            E escape
            ===
            PB.E.
        `);
        engine.gameState.movePlayer("RR");
        expectations.expectPlayerAt(engine.gameState, 2, 0);
        expectations.expectTileAt(engine.gameState, 3, 0, "block"); // should cover the exit
    });
});
