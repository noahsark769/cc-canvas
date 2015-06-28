let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { getMockCanvas } = reqlib("/testing/utils");
let { Animator } = reqlib("/src/animation/Animator");
let { Wall } = reqlib("/src/tile/Wall");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { CCClassicImageRenderer } = reqlib("/src/animation/renderers/image/CCClassicImageRenderer");

describe("Animator", () => {
    it("should import correctly", () => {});
    it("should call canvas drawImage with ImageRenderer", () => {
        let drawImageSpy = sinon.spy();
        let canvas = getMockCanvas(drawImageSpy);
        let tile = new Wall(new CCClassicImageRenderer(sinon.spy(), function () {}));
        let animator = new Animator(canvas);
        animator.renderTile(tile, new Coordinate(0, 0));
        expect(drawImageSpy).to.have.been.called;
    });
});
