let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let path = require("path");
let { FSDatParser } = reqlib("/src/data/FSDatParser");

describe("DatParsers", () => {
    it("should import correctly", () => {});
    it("should parse intro.dat without error", () => {
        let parser = new FSDatParser(path.dirname(__filename) + "/intro.dat");
        let levelSet = parser.parseToLevelSet();

        expect(levelSet.numLevels).to.equal(9);
        expect(levelSet.levels[0].title).to.equal("KEYS AND CHIPS");
        expect(levelSet.levels[0].hint).to.equal("Collect keys in order to open doors. Collect chips in order to open the socket.");
    });
});
