let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { CoordinateEntityMap } = reqlib("/src/core/2d/CoordinateEntityMap");

describe("CoordinateEntityMap", () => {
    it("should import correctly", () => {});
    it("should support cloning", () => {
        let map = new CoordinateEntityMap();
        map.setEntityByName(0, 0, "player");
        let map2 = map.clone();
        expect(map2.has(0, 0)).to.be.true;
        map2.setEntityByName(0, 0, "bug");
        expect(map2.get(0, 0).name).to.equal("bug");
        expect(map.get(0, 0).name).to.equal("player");
    });
});
