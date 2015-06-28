let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { GameState } = reqlib("/src/core/GameState");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

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
    it("should support simple player machanics", () => {
        let state = new GameState();
        state.setLevel(LevelBuilder.generateEmptyLevel(4, 4, "floor"));
        state.setPlayerPosition(1, 1);
        state.movePlayerUp();
        let [x, y] = state.getPlayerPosition().asArray();
        expect(x).to.equal(1);
        expect(y).to.equal(0);
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
