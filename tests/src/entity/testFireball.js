let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Fireball", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            F fireball-west
            ===
            P....
            .....
            ....F
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "fireball");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "fireball");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "fireball");
    });
    it("should move correctly", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            F fireball-west
            W wall
            ===
            P.W.....
            .......W
            .W.F..W.
            ........
            ===
            ........
            ........
            ........
            ........
            ===
            3 2
        `)).step();
        expectations.expectEntityAtCoordSequence(engine, "fireball", new Coordinate(3, 2), "lurrrrurllllddd");
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            F fireball-south
            ===
            P...W...
            ...W.W..
            ....F...
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
        engine.loadLevelSet(new LevelSet([level])).step();
        expectations.expectEntityAtCoordSequence(engine, "fireball", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            F fireball-west
            ===
            ....
            P..F
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level])).step();
        sinon.stub(engine, "resetCurrentLevel");
        expectations.expectEntityAtCoordSequence(engine, "fireball", new Coordinate(3, 1), "lll");
        expectations.expectLoss(engine.gameState);
    });
    it.skip("be killed by everything except fire");
});
