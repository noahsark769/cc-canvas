let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { GameEngine } = reqlib("/src/GameEngine");

describe("GameEngine", () => {
    it("should be available via import", () => {});
    it("should work with appRootPath imports and chai", () => {
        expect(1).to.equal(1);
    });
});
