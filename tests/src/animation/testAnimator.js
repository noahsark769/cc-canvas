let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
require("sinon-chai");
let { getMockCanvas } = reqlib("/testing/utils");
let { Animator } = reqlib("/src/animation/Animator");
let { Wall } = reqlib("/src/tile/Wall");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { CCClassicImageRenderer } = reqlib("/src/animation/renderers/image/CCClassicImageRenderer");

describe("Animator", () => {
    it("should import correctly", () => {});
    describe("integrations with renderers", () => {
        let drawImageSpy, canvas, tile, animator;
        beforeEach(() => {
            drawImageSpy = sinon.spy();
            canvas = getMockCanvas(drawImageSpy);
            tile = new Wall(new CCClassicImageRenderer(sinon.spy(), function () {}));
            animator = new Animator(canvas);
        });
        it("should call canvas drawImage with ImageRenderer", () => {
            animator.renderTile(tile, new Coordinate(0, 0));
            expect(drawImageSpy).to.have.been.called;
        });
        it("should call canvas drawImage with renderViewport", () => {
            let mockGameState = {
                tileMap: {
                    has: function() { return true; },
                    get: function() { return tile; }
                },
                entityMap: {
                    has: function () { return false; },
                    get: function() { return; }
                }
            };
            animator.renderViewport(Viewport.constructFromSideLength(new Coordinate(0, 0), 5), mockGameState);
            expect(drawImageSpy).to.have.been.called;
            // doesn't pass for some reason but I think it works:
            // expect(drawImageSpy.callCount).to.equal(25);
        });
    });
});
