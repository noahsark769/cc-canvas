let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { TileManager } = reqlib("/src/tile/TileManager");

describe("TileManager", () => {
    it("should import correctly", () => {});
    it("should be singleton", () => {
        let manager = TileManager.getInstance();
        manager.someProperty = 1;
        let manager2 = TileManager.getInstance();
        expect(manager.someProperty).to.equal(1);
    });
    it("should find tile with name", () => {
        let klass = TileManager.getInstance().tileClassByName("wall");
        let instance = new klass(sinon.spy());
        expect(instance.name).to.equal("wall");
    });
});
