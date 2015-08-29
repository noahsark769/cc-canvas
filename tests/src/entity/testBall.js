let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Ball", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            O ball-west
            ===
            P....
            .....
            ....O
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "ball");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "ball");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "ball");
    });
    it("should move correctly", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            O ball-north
            o ball-east
            W wall
            ===
            P.......
            W.....OW
            W...o..W
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            4 2
            6 1
        `)).step();
        function expectTwoBalls(x1, y1, x2, y2) {
            expectations.expectEntityAt(engine.gameState, x1, y1, "ball");
            expectations.expectEntityAt(engine.gameState, x2, y2, "ball");
        }
        expectTwoBalls(6, 1, 4, 2);
        engine.step();
        expectTwoBalls(6, 0, 5, 2);
        engine.step();
        expectTwoBalls(6, 1, 6, 2);
        engine.step();
        expectTwoBalls(6, 2, 5, 2);
        engine.step();
        expectTwoBalls(6, 3, 4, 2);
        engine.step();
        expectTwoBalls(6, 2, 3, 2);
        engine.step();
        expectTwoBalls(6, 1, 2, 2);
        engine.step();
        expectTwoBalls(6, 0, 1, 2);
        engine.step();
        expectTwoBalls(6, 1, 2, 2);
        engine.step();
        expectTwoBalls(6, 2, 3, 2);
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            O ball-south
            ===
            P...W...
            ........
            ....O...
            ........
            ........
            ....W...
            ===
            ........
            ........
            ........
            ........
            ........
            ........
            ===
            4 2
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        expectations.expectEntityAtCoordSequence(engine, "ball", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            O ball-west
            ===
            ....
            P..O
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        let stub = sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAtCoordSequence(engine, "ball", new Coordinate(3, 1), "lll");
        expectations.expectLoss(engine.gameState);
        stub.restore();
    });
    it.skip("should be killed by everything except fire");
});
