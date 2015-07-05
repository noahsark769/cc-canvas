let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { LevelSet } = reqlib("/src/core/LevelSet");

describe("LevelSet", () => {
    it("should import correctly", () => {});
    it("should support adding levels", () => {
        let set = new LevelSet();
        set.addLevel(LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            ===
            ...P.
            .....
        `));
        set.addLevel(LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            ===
            ..P..
            .....
        `));
        expect(set.numLevels).to.equal(2);
    });
});
