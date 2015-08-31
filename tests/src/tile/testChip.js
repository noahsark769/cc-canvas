let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Chip", () => {
    it("should import correctly", () => {});
    it("should be collectable by player", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            W wall
            P player-south-normal
            C chip
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
    it("should block blocks and monsters", () => {
        expectations.expectTileToBlockBlocks("chip");
        expectations.expectTileToBlockMonsters("chip");
    });
});
