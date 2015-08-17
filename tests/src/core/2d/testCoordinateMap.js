let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { TwoLayerCoordinateMap } = reqlib("/src/core/2d/TwoLayerCoordinateMap");
let { CoordinateTileMap } = reqlib("/src/core/2d/CoordinateTileMap");

describe("TwoLayerCoordinateMap", () => {
    it("should import correctly", () => {});
    it("should support set/size", () => {
        let map = new TwoLayerCoordinateMap();
        expect(map.size).to.equal(0);
        map.set(0, 0, "value");
        expect(map.size).to.equal(1);
        map.set(-1, -1, "other value")
        expect(map.size).to.equal(2);
        map.set(0, 0, {something: 1});
    });
    it("should support get/has", () => {
        let map = new TwoLayerCoordinateMap();
        expect(map.get(0, 0)).to.be.undefined;
        expect(map.has(0, 0)).to.be.false;
        map.set(0, 0, "value");
        expect(map.get(0, 0)).to.equal("value");
        expect(map.has(0, 0)).to.be.true;
    });
    it("should support delete", () => {
        let map = new TwoLayerCoordinateMap();
        map.set(0, 0, "value");
        map.delete(0, 0);
        expect(map.size).to.equal(0);
        expect(map.has(0, 0)).to.be.false;
    });
    it("should support move (without deleting)", () => {
        let map = new TwoLayerCoordinateMap();
        let stub = sinon.stub(map, "delete");
        map.set(0, 0, "value");
        map.move(0, 0, 1, 1);
        expect(map.size).to.equal(1);
        expect(map.has(0, 0)).to.be.false;
        expect(map.has(1, 1)).to.be.true;
        expect(map.get(1, 1)).to.equal("value");
        expect(stub.called).to.not.be.true;
    });
});

describe("CoordinateTileMap", () => {
    it("should import correctly", () => {});
    it("should support adding tiles", () => {
        let map = new CoordinateTileMap();
        map.setTileByName(1, 1, "wall", 1);
        map.setTileByName(1, 1, "floor", 2);
        expect(map.get(1, 1, 1).name).to.equal("wall");
        expect(map.get(1, 1, 2).name).to.equal("floor");
    });
    it("should clone correctly", () => {
        let map = new CoordinateTileMap();
        map.setTileByName(1, 1, "wall", 1);
        map.setTileByName(1, 1, "floor", 2);
        let newMap = map.clone();
        map.setTileByName(1, 1, "water", 1);
        map.setTileByName(1, 1, "fire", 2);
        expect(newMap.get(1, 1, 1).name).to.equal("wall");
        expect(newMap.get(1, 1, 2).name).to.equal("floor");
    });
});
