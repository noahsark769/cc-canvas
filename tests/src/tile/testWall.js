let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Wall", () => {
    it("should import correctly", () => {});
    it("should block player progress", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            ===
            ...
            .WP
            ...
        `);
        let expectPlayer = function(x, y) { expectations.expectPlayerAt(state, x, y); }
        state.movePlayer("L");
        expectPlayer(2, 1); // no move, since wall is in the way
        state.movePlayer("D");
        expectPlayer(2, 2);
        state.movePlayer("LU");
        expectPlayer(1, 2);
        state.movePlayer("LUR");
        expectPlayer(0, 1);
    });
    it("should register impass for monsters on pop up from lower level", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            O ball-east
            W wall
            E escape
            ===
            .........
            .........
            ........P
            .O.......
            ........E
            .........
            .........
            .........
            ===
            .........
            .........
            .........
            ........W
            .........
            .........
            .........
            .........
            ===
            1 3
        `)).step();
        engine.enqueuePlayerMovement("down");
        engine.tick();
        engine.step().step().step().step().step().step().step();
        expect(engine.gameState.isOver).to.be.false;
        expectations.expectEntityAt(engine.gameState, 5, 3, "ball");
    });
    it("should pop up from under floor", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            W wall
            ===
            .P
            ..
            ===
            ..
            .W
        `));
        engine.gameState.movePlayer("DUD");
        // should have been blocked by wall that popped up
        expectations.expectPlayerAt(engine.gameState, 1, 0);
    });
});
