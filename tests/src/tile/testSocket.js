let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

describe("Socket", () => {
    it("should import correctly", () => {});
    it("should block player until all chips collected", () => {
        let [state, level] = buildLevelFromSchematic(`
            . tile floor
            W tile wall
            P entity player
            C tile chip
            S tile socket
            ===
            C..
            .WP
            C.S
        `);
        state.movePlayer("D");
        expectations.expectPlayerAt(state, 2, 1); // should have blocked
        state.movePlayer("ULLDDRRU");
        expectations.expectPlayerAt(state, 2, 1);
        expect(state.tileMap.get(2, 2).name).to.equal("floor");
    });
});
