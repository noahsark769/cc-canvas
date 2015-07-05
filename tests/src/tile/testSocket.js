let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Socket", () => {
    it("should import correctly", () => {});
    it("should block player until all chips collected", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            C chip
            S socket
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
