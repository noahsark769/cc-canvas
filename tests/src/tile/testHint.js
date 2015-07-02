let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

describe("Hint", () => {
    it("should import correctly", () => {});
    it("should show hint on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            H tile hint
            ===
            ...
            .HP
            ...
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        let stub = sinon.stub(engine, "interface");
        engine.gameState.movePlayer("L");
        expect(stub.calledWith("showHint")).to.be.ok;
        engine.gameState.movePlayer("L");
        expect(stub.calledWith("hideHint")).to.be.ok;
    });
});
