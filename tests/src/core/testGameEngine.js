let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { getMockDocument } = reqlib("/testing/utils");

describe("GameEngine", () => {
    beforeEach(() => {
        GameEngine.reset(getMockDocument());
    });
    it("should be available via import", () => {});
    it("should work with appRootPath imports and chai", () => {
        expect(1).to.equal(1);
    });
    it("should be singleton", () => {
        let engine1 = GameEngine.getInstance(getMockDocument());
        engine1.someProperty = true;
        let engine2 = GameEngine.getInstance(getMockDocument());
        expect(engine2.someProperty).to.be.true;
    });
    it("should tick correctly", () => {
        let engine = GameEngine.getInstance(getMockDocument());
        expect(engine.gameState.currentTicks).to.equal(0);
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(1);
    });
    it("should pause correctly", () => {
        let engine = GameEngine.getInstance(getMockDocument());
        engine.tick();
        engine.pause();
        expect(engine.gameState.currentTicks).to.equal(1);
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(1);
        engine.unpause();
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(2);

        engine.togglePause(); // now paused
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(2);
        engine.togglePause();
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(3);
    });
    it("should map two ticks to one step", () => {
        let engine = GameEngine.getInstance(getMockDocument());
        expect(engine.gameState.currentTicks).to.equal(0);
        engine.step();
        expect(engine.gameState.currentTicks).to.equal(2);
    });
});
