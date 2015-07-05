let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Hint", () => {
    it("should import correctly", () => {});
    it("should show hint on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            H hint
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
