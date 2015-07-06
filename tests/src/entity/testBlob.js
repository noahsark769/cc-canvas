let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Blob", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move only every other step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            b blob-west
            ===
            P....
            ...WW
            ..W.b
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
        engine.loadLevelSet(new LevelSet([level]));
        expectations.expectEntityAt(engine.gameState, 4, 2, "blob");
        engine.step();
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "blob");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 4, 2, "blob");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "blob");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 4, 2, "blob");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            b blob-west
            ===
            ...W
            ..Pb
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step().step();
        sinon.stub(engine, "resetCurrentLevel");
        engine.step();
        expectations.expectLoss(engine.gameState);
    });
    it.skip("should be killed by everything");
});
