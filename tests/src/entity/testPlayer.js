let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Player", () => {
    it("should import correctly", () => {});
});

describe("Player tiles", () => {
    it("should import correctly", () => {});
    describe("(swimming chip)", () => {
        it.skip("should block chip");
        it.skip("should cause loss when hit by monster");
    });
    describe("(drowned chip)", () => {
        it.skip("should behave as wall");
    });
    describe("(burned chip)", () => {
        it.skip("should behave as wall");
    });
    describe("(charred chip)", () => {
        it.skip("should behave as wall");
    });
});
