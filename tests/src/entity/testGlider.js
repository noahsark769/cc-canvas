let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Glider", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            G glider-west
            ===
            P....
            .....
            ....G
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "glider");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "glider");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "glider");
    });
    it("should move correctly", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            G glider-west
            W wall
            ===
            P.WW....
            .W.....W
            W.W....G
            ....W...
            ===
            ........
            ........
            ........
            ........
            ===
            7 2
        `));
        expectations.expectEntityAtCoordSequence(engine, "glider", new Coordinate(7, 2), "lllldlllrrruulrrrrullddrrr");
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            G glider-south
            ===
            P...W...
            ...W.W..
            ....G...
            ........
            ...W.W..
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
        engine.loadLevelSet(new LevelSet([level]));
        expectations.expectEntityAtCoordSequence(engine, "glider", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            G glider-west
            ===
            ....
            P..G
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAtCoordSequence(engine, "glider", new Coordinate(3, 1), "lll");
        expectations.expectLoss(engine.gameState);
    });
    it.skip("be killed by everything except water");
});
