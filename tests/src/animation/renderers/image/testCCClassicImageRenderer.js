let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { CCClassicImageRenderer } = reqlib("/src/animation/renderers/image/CCClassicImageRenderer");

describe("CCClassicImageRenderer", () => {
    it("should import correctly", () => {});
    it("should construct correctly", () => {
        let Image = sinon.spy();
        let renderer = new CCClassicImageRenderer(Image, () => {});
    });
});
