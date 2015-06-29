let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.fromSchematic(schematic);
    let level = builder.generateLevel();
    if (builder.hasPlayer()) {
        state.setPlayerPosition(...builder.getPlayerPosition().asArray());
    }
    state.setLevel(level);
    return [state, level];
}

describe("Wall", () => {
    it("should import correctly", () => {});
    it("should block player progress", () => {
        let [state, level] = buildLevelfromSchematic(`
            . tile floor
            W tile wall
            P entity player
            ==================
            ...
            .WP
            ...
        `);
        let expectPlayer = function(x, y) { expectations.expectPlayerAt(state, x, y); }
        state.movePlayerLeft();
        expectPlayer(2, 1); // no move, since wall is in the way
        state.movePlayerDown();
        expectPlayer(2, 2);
        state.movePlayer("LU");
        expectPlayer(1, 2);
        state.movePlayer("LUR");
        expectPlayer(0, 1);
    });
});
