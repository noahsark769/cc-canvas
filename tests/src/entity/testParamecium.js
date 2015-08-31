let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Paramecium", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            p paramecium-west
            ===
            P....
            .....
            ....p
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "paramecium");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 4, 1, "paramecium");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 4, 0, "paramecium");
    });
    it("should move correctly", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            p paramecium-north
            W wall
            ===
            P.WW.W..
            .W...W.W
            W.W.W..p
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            7 2
        `)).step();
        expectations.expectEntityAtCoordSequence(engine, "paramecium", new Coordinate(7, 2), "luurlddldlluurudllrddlludlrrrrrrru");
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            p paramecium-south
            ===
            P...W...
            ...W.W..
            ...WpW..
            ...W.W..
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
        engine.loadLevelSet(new LevelSet([level])).step();
        expectations.expectEntityAtCoordSequence(engine, "paramecium", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should move in circle in space", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            p paramecium-west
            W wall
            ===
            P.......
            .p......
            ........
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            1 1
        `)).step();
        expectations.expectEntityAtCoordSequence(engine, "paramecium", new Coordinate(1, 1), "urdlurdlurdl");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            p paramecium-north
            ===
            ....
            P..p
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        let stub = sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAtCoordSequence(engine, "paramecium", new Coordinate(3, 1), "ullld");
        expectations.expectLoss(engine.gameState);
        stub.restore();
    });
});
