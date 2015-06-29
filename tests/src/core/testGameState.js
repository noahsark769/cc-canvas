let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { GameState } = reqlib("/src/core/GameState");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildSimpleLevelWithPlayerAt(width, height, defaultTile, playerX, playerY) {
    let state = new GameState();
    let builder = new LevelBuilder(width, height, defaultTile);
    builder.addEntityAt(playerX, playerY, "player");
    state.setPlayerPosition(playerX, playerY);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

function expectNoEntityAt(state, x, y) {
    expect(state.hasEntityAt(x, y), "found entity at " + x + ", " + y).to.be.false;
}
function expectEntityAt(state, x, y, name) {
    expect(state.hasEntityAt(x, y), "no " + name + " at " + x + ", " + y).to.be.true;
    expect(state.getEntityAt(x, y).name).to.equal(name);
}
function expectPlayerAt(state, x, y) {
    expectEntityAt(state, x, y, "player");
}

describe("GameState", () => {
    it("should import correctly", () => {});
    it("should tick correctly", () => {
        let state = new GameState();
        expect(state.currentTicks).to.equal(0);
        state.tick();
        expect(state.currentTicks).to.equal(1);
        state.tick();
        expect(state.currentTicks).to.equal(2);
    });
    it("should support tile state", () => {
        let state = new GameState();
        state.setLevel(new LevelBuilder.generateEmptyLevel(4, 4, "floor"));
        state.tileMap.setTileByName(1, 1, "wall");

        expect(state.hasTileAt(0, 0), "0, 0").to.be.true;
        expect(state.getTileAt(0, 0).name).to.equal("floor");
        expect(state.hasTileAt(1, 1), "1, 1").to.be.true;
        expect(state.getTileAt(1, 1).name).to.equal("wall");
    });
    it("should know about parity of ticks", () => {
        let state = new GameState();
        expect(state.currentTicks).to.equal(0);
        expect(state.even()).to.be.ok;
        expect(state.odd()).to.not.be.ok;
        state.tick();
        expect(state.even()).to.not.be.ok;
        expect(state.odd()).to.be.ok;
        state.tick();
        expect(state.even()).to.be.ok;
        expect(state.odd()).to.not.be.ok;
    });

    describe("player mechanics", () => {
        it("should support simple player machanics", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(4, 4, "floor", 1, 1);
            state.movePlayerUp();
            let [x, y] = state.getPlayerPosition().asArray();
            expect(x).to.equal(1);
            expect(y).to.equal(0);
            expectNoEntityAt(state, 1, 1);
            expectPlayerAt(state, 1, 0);
        });
        it("should not allow the player to move outside of level", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(3, 3, "floor", 1, 1);
            state.movePlayerLeft();
            state.movePlayerLeft();
            expectNoEntityAt(state, 1, 1);
            expectPlayerAt(state, 0, 1);
            state.movePlayerUp();
            expectPlayerAt(state, 0, 0);
            state.movePlayerUp();
            state.movePlayerLeft();
            expectPlayerAt(state, 0, 0);
            state.movePlayerRight();
            state.movePlayerRight();
            state.movePlayerRight();
            expectPlayerAt(state, 2, 0);
            state.movePlayerDown();
            state.movePlayerDown();
            state.movePlayerDown();
            expectPlayerAt(state, 2, 2);
        });
    });

    it("should support getting viewport", () => {
        let state = new GameState();
        state.setLevel(LevelBuilder.generateEmptyLevel(4, 4, "floor"));
        let viewport = state.getViewport();
        expect(viewport).to.be.instanceof(Viewport);
    });
    it.skip("should have viewport follow player", () => {});
    it.skip("should have viewport stop at bounds of level", () => {});
});
