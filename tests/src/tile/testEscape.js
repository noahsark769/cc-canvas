let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");

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
});
