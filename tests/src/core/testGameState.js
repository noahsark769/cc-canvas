let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildSimpleLevelWithPlayerAt(width, height, defaultTile, playerX, playerY) {
    let state = new GameState();
    let builder = new LevelBuilder(width, height, defaultTile);
    builder.addEntityAt(playerX, playerY, "player");
    let level = builder.generateLevel();
    state.setLevel(level);
    state.setPlayerPosition(playerX, playerY);
    return [state, level];
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
            expectations.expectNoEntityAt(state, 1, 1);
            expectations.expectPlayerAt(state, 1, 0);
        });
        it("should not allow the player to move outside of level", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(3, 3, "floor", 1, 1);
            state.movePlayerLeft();
            state.movePlayerLeft();
            expectations.expectNoEntityAt(state, 1, 1);
            expectations.expectPlayerAt(state, 0, 1);
            state.movePlayerUp();
            expectations.expectPlayerAt(state, 0, 0);
            state.movePlayerUp();
            state.movePlayerLeft();
            expectations.expectPlayerAt(state, 0, 0);
            state.movePlayerRight();
            state.movePlayerRight();
            state.movePlayerRight();
            expectations.expectPlayerAt(state, 2, 0);
            state.movePlayerDown();
            state.movePlayerDown();
            state.movePlayerDown();
            expectations.expectPlayerAt(state, 2, 2);
        });
    });

    describe("viewport", () => {
        it("should support getting viewport", () => {
            let state = new GameState();
            state.setLevel(LevelBuilder.generateEmptyLevel(4, 4, "floor"));
            let viewport = state.getViewport();
            expect(viewport).to.be.instanceof(Viewport);
        });
        it("should have viewport follow player", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(32, 32, "floor", 16, 16);
            // player is at 16, 16. go down down, right right and make sure the viewport
            // is still centered on player
            state.movePlayer("DDRR");
            expect(state.getViewport().getCenter().asArray()).to.deep.equals([18, 18]);
        });
        it("should have viewport stop at bounds of level", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(32, 32, "floor", 16, 16);
            // move to the corners. Make sure it's centered in the corners as far as it should go
            state.movePlayer("DDRRRRRRRRRRRRRRRR");
            expect(state.getViewport().getCenter().asArray()).to.deep.equals([27, 18]);
            expect(state.getViewport().getCenter())
            state.movePlayer("DDDDDDDDDDDDDD");
            expect(state.getViewport().getCenter().asArray()).to.deep.equals([27, 27]);
            state.movePlayer("UUUUUUUUUUUUUUUUUUUUUUUUUUU");
            expect(state.getViewport().getCenter().asArray()).to.deep.equals([27, 4]);
        });
        it("should not let viewport get offset from player location", () => {
            let [state, level] = buildSimpleLevelWithPlayerAt(32, 32, "floor", 16, 16);
            state.movePlayer("RRRRRRRRRRRRRRRR");
            state.movePlayer("LLLLLLLLLLLLLLLL");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.getViewport());
            state.movePlayer("LLLLLLLLLLLLLLLL");
            state.movePlayer("RRRRRRRRRRRRRRRR");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.getViewport());
            state.movePlayer("DDDDDDDDDDDDDDDD");
            state.movePlayer("UUUUUUUUUUUUUUUU");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.getViewport());
            state.movePlayer("UUUUUUUUUUUUUUUU");
            state.movePlayer("DDDDDDDDDDDDDDDD");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.getViewport());
        });
    });
});
