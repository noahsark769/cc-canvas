let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");
let { Level } = reqlib("/src/core/Level");
let { GameState } = reqlib("/src/core/GameState");

describe("LevelBuilder", () => {
    it("should import correctly", () => {});
    it("should construct with width and height", () => {
        let builder = new LevelBuilder(4, 3);
        expect(builder.width).to.equal(4);
        expect(builder.height).to.equal(3);
    });
    it("should support setting renderer", () => {
        let builder = new LevelBuilder(4, 3);
        let renderer = sinon.spy();
        renderer.someProperty = 1;
        builder.setRenderer(renderer);
        expect(builder.renderer.someProperty).to.equal(1);
    });
    it("should support adding tiles", () => {
        let builder = new LevelBuilder(10, 10);
        builder.setRenderer(sinon.spy());
        builder.addTileAt(0, 0, "wall");
        builder.addTileAt(1, 1, "wall");
        expect(builder.tileMap.get(0, 0).name).to.equal("wall");
        expect(builder.tileMap.get(1, 1).name).to.equal("wall");
    });
    it("should support adding player", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addEntityAt(1, 1, "player");
        let level = builder.generateLevel();
        expect(level.entityMap.get(1, 1).name).to.equal("player");
    });
    it("should support building a Level", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addTileAt(0, 0, "wall");
        let level = builder.generateLevel();
        expect(level.tileMap.get(0, 0).name).to.equal("wall");
    });
    it("should support resetting", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addTileAt(5, 5, "wall");
        builder.reset();
        expect(builder.tileMap.has(5, 5)).to.be.false;
    });

    describe("default tile support", () => {
        it("should support default tiles", () => {
            let builder = new LevelBuilder(10, 10);
            builder.setDefaultTileType("floor");
            expect(builder.hasTileAt(0, 0)).to.be.true;
            expect(builder.getTileAt(0, 0).name).to.equal("floor");

            builder.addTileAt(0, 0, "wall");
            expect(builder.hasTileAt(0, 0)).to.be.true;
            expect(builder.getTileAt(0, 0).name).to.equal("wall");

            // out of bounds tiles should still return false
            expect(builder.hasTileAt(9, 10)).to.be.false;
            expect(builder.hasTileAt(10, 9)).to.be.false;
            expect(builder.hasTileAt(100, 100)).to.be.false;
        });
        it("should support default tile type in constructor", () => {
            let builder = new LevelBuilder(10, 10, "floor");
            expect(builder.hasTileAt(0, 0)).to.be.true;
            expect(builder.getTileAt(0, 0).name).to.equal("floor");
        });
        it("should support default construction of empty level", () => {
            let level = LevelBuilder.generateEmptyLevel(4, 4, "floor");
            expect(level).to.be.an.instanceof(Level);
            expect(level.tileMap.has(0, 0)).to.be.true;
            expect(level.tileMap.has(3, 3)).to.be.true;
        });
        it("should export default tiles to level", () => {
            let builder = new LevelBuilder(3, 3);
            builder.setDefaultTileType("floor");
            builder.addTileAt(0, 0, "wall").addTileRight().addTileRight().addTileRight()
                .addTileDown().addTileDown().addTileDown()
                .addTileLeft().addTileLeft().addTileLeft()
                .addTileUp().addTileUp();
            let level = builder.generateLevel();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if ([1, 2].indexOf(i) !== -1 && [1, 2].indexOf(j) !== -1) {
                        expect(level.tileMap.get(i, j).name, i + ", " + j).to.equal("floor");
                    } else {
                        expect(level.tileMap.get(i, j).name, i + ", " + j).to.equal("wall");
                    }
                }
            }
        });
    });
    describe("chaining support", () => {
        let builder = new LevelBuilder(10, 10);
        beforeEach(() => {
            builder.reset();
        });
        it("should support chaining right", () => {
            builder.addTileAt(0, 0, "wall").addTileRight("wall").addTileRight("wall");
            expect(builder.tileMap.get(1, 0).name).to.equal("wall");
            expect(builder.tileMap.get(2, 0).name).to.equal("wall");
            expect(builder.tileMap.has(3, 0)).to.be.false;
            expect(builder.tileMap.has(0, 1)).to.be.false;
        });

        it("should support chaining left", () => {
            builder.addTileAt(9, 0, "wall").addTileLeft("wall").addTileLeft("wall");
            expect(builder.tileMap.get(8, 0).name).to.equal("wall");
            expect(builder.tileMap.get(7, 0).name).to.equal("wall");
            expect(builder.tileMap.has(6, 0)).to.be.false;
            expect(builder.tileMap.has(9, 1)).to.be.false;
        });

        it("should support chaining down", () => {
            builder.addTileAt(0, 0, "wall").addTileDown("wall").addTileDown("wall");
            expect(builder.tileMap.get(0, 1).name).to.equal("wall");
            expect(builder.tileMap.get(0, 2).name).to.equal("wall");
            expect(builder.tileMap.has(0, 3)).to.be.false;
            expect(builder.tileMap.has(1, 0)).to.be.false;
        });

        it("should support chaining up", () => {
            builder.addTileAt(9, 9, "wall").addTileUp("wall").addTileUp("wall");
            expect(builder.tileMap.get(9, 8).name).to.equal("wall");
            expect(builder.tileMap.get(9, 7).name).to.equal("wall");
            expect(builder.tileMap.has(9, 6)).to.be.false;
            expect(builder.tileMap.has(8, 9)).to.be.false;
        });

        it("should support chaining multiple directions", () => {
            builder.addTileAt(0, 0, "wall").addTileRight().addTileRight()
                .addTileDown().addTileDown()
                .addTileLeft().addTileLeft()
                .addTileUp();
            for (let i in [1, 2, 3]) {
                for (let j in [1, 2, 3]) {
                    if (!(i == 1 && j == 1)) {
                        expect(builder.tileMap.has(i, j)).to.be.true;
                    }
                }
            }
            let level = builder.generateLevel();
            for (let i in [1, 2, 3]) {
                for (let j in [1, 2, 3]) {
                    if (!(i == 1 && j == 1)) {
                        expect(level.tileMap.has(i, j)).to.be.true;
                        expect(level.tileMap.get(i, j).name).to.equal("wall");
                    }
                }
            }
        });

        it("should support chaining with implied tile types", () => {
            builder.addTileAt(0, 0, "wall").addTileRight().addTileRight("floor").addTileRight();
            expect(builder.tileMap.get(0, 0).name).to.equal("wall");
            expect(builder.tileMap.get(1, 0).name).to.equal("wall");
            expect(builder.tileMap.get(2, 0).name).to.equal("floor");
            expect(builder.tileMap.get(3, 0).name).to.equal("floor");
        });
    });

    describe("schematics", () => {
        it("should build level from schematic", () => {
            let builder = LevelBuilder.buildFromSchematic(`
                . tile floor
                ===
                ...
                ...
                ...
                ...
            `);
            let level = builder.generateLevel();
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
            let level = LevelBuilder.generateFromSchematic(`
                . tile floor
                W tile wall
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
            let level = LevelBuilder.generateFromSchematic(`
                . tile floor
                W tile wall
                P entity player
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
});
