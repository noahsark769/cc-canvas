let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

describe("LevelBuilder", () => {
    it("should import correctly", () => {});
    it("should construct with width and height", () => {
        let builder = new LevelBuilder(4, 3);
        expect(builder.width).to.equal(4);
        expect(builder.height).to.equal(3);
    });
    it("should support adding tiles", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addTileAt(0, 0, "wall");
        builder.addTileAt(1, 1, "wall");
        expect(builder.tileMap.get(0, 0).name).to.equal("wall");
        expect(builder.tileMap.get(1, 1).name).to.equal("wall");
    });
    it("should support building a Level", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addTileAt(0, 0, "wall");
        let level = builder.generateLevel();
        expect(level.tileMap.get(0, 0).name).to.equal("wall");
    });
    it("should support resetting", () => {
        let builder = new LevelBuilder(10, 10);
        builder.addTileAt(5, 5);
        builder.reset();
        expect(builder.tileMap.get(5, 5)).to.be.null;
    });
    describe.skip("chaining support", () => {
        let builder = new LevelBuilder(10, 10);
        it("should support chaining right", () => {
            builder.addTileAt(0, 0, "wall").addTileRight("wall").addTileRight("wall");
            expect(builder.tileMap.get(1, 0).name).to.equal("wall");
            expect(builder.tileMap.get(2, 0).name).to.equal("wall");
            expect(builder.tileMap.get(3, 0)).to.be.null;
            expect(builder.tileMap.get(0, 1)).to.be.null;
        });

        builder.reset();
        it("should support chaining left", () => {
            builder.addTileAt(9, 0, "wall").addTileLeft("wall").addTileLeft("wall");
            expect(builder.tileMap.get(9, 0).name).to.equal("wall");
            expect(builder.tileMap.get(8, 0).name).to.equal("wall");
            expect(builder.tileMap.get(7, 0)).to.be.null;
            expect(builder.tileMap.get(9, 1)).to.be.null;
        });

        builder.reset();
        it("should support chaining down", () => {
            builder.addTileAt(0, 0, "wall").addTileDown("wall").addTileDown("wall");
            expect(builder.tileMap.get(0, 0).name).to.equal("wall");
            expect(builder.tileMap.get(0, 1).name).to.equal("wall");
            expect(builder.tileMap.get(0, 2)).to.be.null;
            expect(builder.tileMap.get(1, 0)).to.be.null;
        });

        builder.reset();
        it("should support chaining up", () => {
            builder.addTileAt(9, 9, "wall").addTileUp("wall").addTileUp("wall");
            expect(builder.tileMap.get(9, 9).name).to.equal("wall");
            expect(builder.tileMap.get(9, 8).name).to.equal("wall");
            expect(builder.tileMap.get(9, 7)).to.be.null;
            expect(builder.tileMap.get(8, 9)).to.be.null;
        });

        builder.reset();
        it("should support chaining with implied tile types", () => {
            builder.addtileAt(0, 0, "wall").addTileRight().addTileRight("floor").addTileRight();
            expect(builder.tileMap.get(0, 0).name).to.equal("wall");
            expect(builder.tileMap.get(1, 0).name).to.equal("wall");
            expect(builder.tileMap.get(2, 0).name).to.equal("floor");
            expect(builder.tileMap.get(3, 0).name).to.equal("floor");
        });
    });
});
