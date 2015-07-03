let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

function expectEntityAtCoordSequence(engine, entity, startCoord, sequence) {
    let coord = startCoord;
    expectations.expectEntityAt(engine.gameState, coord.x, coord.y, entity);

    for (let char of sequence) {
        coord = coord[char]();
        engine.step();
        expectations.expectEntityAt(engine.gameState, coord.x, coord.y, entity);
    }
}

describe("Bug", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should import correctly", () => {});
    it("should should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-west
            ===
            .....
            .....
            ....B
            WWWWW
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectations.expectEntityAt(engine.gameState, 4, 2, "bug");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "bug");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "bug");
    });
    it("should follow left wall", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-north
            ===
            ........
            ........
            ........
            ..WWWB..
            ........
            ........
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(5, 3), "ullllddrrrru");
    });
    it("should follow inside of box it's in", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-west
            ===
            ..WWWW..
            .W...W..
            .W..BW..
            ..WWWW..
            ........
            ........
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(4, 2), "llurrdllurrd");
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-south
            ===
            ...WWW..
            ...W.W..
            ...WBW..
            ...W.W..
            ...W.W..
            ...WWW..
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should follow end of level when faced with it", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-west
            ===
            ....
            ....
            ....
            ...B
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(3, 3), "llluuurrrdddlll");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            B entity bug-normal-west
            ===
            ....
            ....
            ....
            P..B
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        sinon.stub(engine, "resetCurrentLevel");
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(3, 3), "lll");
        expect(engine.gameState.isOver, "Game was not over").to.be.true;
        expect(engine.gameState.isLoss, "Game was not a loss!").to.be.true;
        expect(engine.gameState.isWin, "Game was a win when it should have been a loss").to.be.false;
    });
});
