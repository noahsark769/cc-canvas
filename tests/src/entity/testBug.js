let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

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
    it("should move on step", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-west
            ===
            P....
            .....
            ....B
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
        expectations.expectEntityAt(engine.gameState, 4, 2, "bug");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 2, "bug");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 2, 2, "bug");
    });
    it("should follow left wall", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-north
            ===
            P.......
            ........
            ........
            ..WWWB..
            ........
            ........
            ===
            ........
            ........
            ........
            ........
            ........
            ........
            ===
            5 3
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(5, 3), "ullllddrrrru");
    });
    it("should follow inside of box it's in", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-west
            ===
            P.WWWW..
            .W...W..
            .W..BW..
            ..WWWW..
            ===
            ........
            ........
            ........
            ........
            ===
            4 2
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(4, 2), "llurrdllurrd");
    });
    it("should reverse when faced with only one lane", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-south
            ===
            P..WWW..
            ...W.W..
            ...WBW..
            ...W.W..
            ...W.W..
            ...WWW..
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
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(4, 2), "dduuuddduuuddd");
    });
    it("should follow end of level when faced with it", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-west
            ===
            ....
            .P..
            ....
            ...B
            ===
            ....
            ....
            ....
            ....
            ===
            3 3
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(3, 3), "llluuurrrdddlll");
    });
    it("should kill player", () => {
        let [nothing, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            B bug-west
            ===
            ....
            P..B
            ===
            ....
            ....
            ===
            3 1
        `);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([level]));
        sinon.stub(engine, "resetCurrentLevel");
        expectEntityAtCoordSequence(engine, "bug", new Coordinate(3, 1), "lll");
        expect(engine.gameState.isOver, "Game was not over").to.be.true;
        expect(engine.gameState.isLoss, "Game was not a loss!").to.be.true;
        expect(engine.gameState.isWin, "Game was a win when it should have been a loss").to.be.false;
    });
    it.skip("should treat fire as walls");
});
