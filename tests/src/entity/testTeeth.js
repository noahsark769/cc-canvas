let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Teeth", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move only every other step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            T teeth-west
            ===
            P....
            .WWWW
            ....T
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "teeth");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "teeth");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "teeth");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 2, "teeth");
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 0, 2, "teeth");
    });
    it("should move correctly", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            T teeth-west
            W wall
            ===
            P.W.....
            ..W.....
            ..WT....
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            3 2
        `));
        sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAt(engine.gameState, 3, 2, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 0, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 0, "teeth");
        engine.gameState.movePlayer("D");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 1, "teeth");
        engine.gameState.movePlayer("D");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "teeth");
        engine.gameState.movePlayer("D");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 3, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 3, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 3, "teeth");
        engine.step(); engine.step();
        expectations.expectLoss(engine.gameState);
    });
    it("should take the longest route to player first", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            T teeth-west
            W wall
            ===
            P.......
            .......T
            ........
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            7 1
        `));
        sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAt(engine.gameState, 7, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 6, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 5, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 4, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 1, "teeth");
    });
    it("should prefer vertical routes to player in ties", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            T teeth-west
            W wall
            ===
            P.......
            ........
            ........
            ...T....
            ===
            ........
            ........
            ........
            ........
            ===
            3 3
        `));
        sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAt(engine.gameState, 3, 3, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 1, "teeth");
        engine.step(); engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 0, "teeth");
    });
});
