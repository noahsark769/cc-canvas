let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Level } = reqlib("/src/core/Level");
let { GameState } = reqlib("/src/core/GameState");

describe("Level", () => {
    it("should import correctly", () => {});
    it("should construct with width and height", () => {
        let level = new Level(4, 3);
        expect(level.width).to.equal(4);
        expect(level.height).to.equal(3);
    });
    it("should have empty maps initially", () => {
        let level = new Level(4, 3);
        expect(level.tileMap.size).to.equal(0);
    });
    it("should not error when getting default viewport", () => {
        let level = new Level(4, 3);
        level.getDefaultViewport();
    });

    describe("schematics", () => {
        it("should build level from schematic", () => {
            let level = Level.buildFromSchematic(`
                . floor
                ===
                ...
                ...
                ...
                ...
            `);
            expect(level.width).to.equal(3);
            expect(level.height).to.equal(4);

            let state = new GameState();
            state.setLevel(level);

            for (let i of [0, 1, 2]) {
                for (let j of [0, 1, 2, 3]) {
                    expectations.expectTileAt(state, i, j, "floor");
                }
            }
        });
        it("should support multiple tile types", () => {
            let level = Level.buildFromSchematic(`
                . floor
                W wall
                ===
                ..W.
                .W..
            `);
            let state = new GameState();
            state.setLevel(level);
            expectations.expectTileAt(state, 0, 0, "floor");
            expectations.expectTileAt(state, 2, 0, "wall");
            expectations.expectTileAt(state, 1, 1, "wall");
        });
        it("should support autosetting player location", () => {
            let level = Level.buildFromSchematic(`
                . floor
                W wall
                P player-south-normal
                ===
                ....
                .WP.
                ....
            `);
            let state = new GameState();
            state.setLevel(level);
            expectations.expectPlayerAt(state, 2, 1);
        });
    });

    it("should have viewport centered on player", () => {
        let level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            .......P........
            ................
            ................
            ................
            ................
            ................
        `);
        let state = new GameState();
        state.setLevel(level);
        expect(level.getDefaultViewport().getCenter().asArray()).to.deep.equals([7, 7]);

        level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            P...............
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
        `);
        state = new GameState();
        state.setLevel(level);
        expect(level.getDefaultViewport().getCenter().asArray()).to.deep.equals([4, 4]);

        level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ................
            ...............P
        `);
        state = new GameState();
        state.setLevel(level);
        expect(level.getDefaultViewport().getCenter().asArray()).to.deep.equals([11, 8]);
    });
    it("should register the first player in RRO if there are two chip tiles", () => {
        let level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ..P
            ...
            ..P
            ...
        `);
        let state = new GameState();
        state.setLevel(level);
        expect(state.player.position.asArray()).to.deep.equals([2, 2]);
    });
});
