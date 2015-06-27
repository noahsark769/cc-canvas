let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { GameEngine } = reqlib("/src/core/GameEngine");

describe("GameEngine", () => {
    it("should be available via import", () => {});
    it("should work with appRootPath imports and chai", () => {
        expect(1).to.equal(1);
    });
    it("should be singleton", () => {
        let engine1 = new GameEngine();
        engine1.someProperty = true;
        let engine2 = new GameEngine();
        expect(engine2.someProperty).to.be.true;
    });
});
