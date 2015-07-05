let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { Level } = reqlib("/src/core/Level");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Wall", () => {
    it("should import correctly", () => {});
    it("should block player progress", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            ===
            ...
            .WP
            ...
        `);
        let expectPlayer = function(x, y) { expectations.expectPlayerAt(state, x, y); }
        state.movePlayer("L");
        expectPlayer(2, 1); // no move, since wall is in the way
        state.movePlayer("D");
        expectPlayer(2, 2);
        state.movePlayer("LU");
        expectPlayer(1, 2);
        state.movePlayer("LUR");
        expectPlayer(0, 1);
    });
});
