let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Level } = reqlib("/src/core/Level");

describe("LevelSet", () => {
    it("should import correctly", () => {});
    it("should support adding levels", () => {
        let set = new LevelSet();
        set.addLevel(Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ...P.
            .....
        `));
        set.addLevel(Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ..P..
            .....
        `));
        expect(set.numLevels).to.equal(2);
    });
});
