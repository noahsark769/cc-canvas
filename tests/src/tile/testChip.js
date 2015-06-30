let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

describe("Chip", () => {
    it("should import correctly", () => {});
    it("should be collectable by player", () => {
        let [state, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            C tile chip
            ===
            C..
            .WP
            C..
        `);
        expect(state.chipsLeft).to.equal(2);
        state.movePlayer("ULL");
        expect(state.chipsLeft).to.equal(1);
        state.movePlayer("DD");
        expect(state.chipsLeft).to.equal(0);
        expect(state.tileMap.get(0, 0).name).to.equal("floor");
    });
});
