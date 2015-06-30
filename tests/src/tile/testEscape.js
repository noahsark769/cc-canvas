let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

describe("Escape", () => {
    it("should import correctly", () => {});
    it("should end game on step", () => {
        let [state, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            E tile escape
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
