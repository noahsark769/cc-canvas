let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Walker", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            w walker-west
            ===
            P....
            ...WW
            ....w
            WWWWW
            ===
            .....
            .....
            .....
            .....
            ===
            4 2
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        expectations.expectEntityAt(engine.gameState, 4, 2, "walker");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "walker");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "walker");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            w walker-west
            ===
            ...W
            P..w
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        let stub = sinon.stub(engine, "resetCurrentLevel");
        engine.step();
        engine.step();
        engine.step();
        expectations.expectLoss(engine.gameState);
        stub.restore();
    });
    it.skip("should be killed by everything (except fire?)");
});
