let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
require("sinon-chai");
let { getMockCanvas } = reqlib("/testing/utils");
let { Animator } = reqlib("/src/animation/Animator");
let { Wall } = reqlib("/src/tile/Wall");
let { Coordinate } = reqlib("/src/core/2d/Coordinate");
let { Viewport } = reqlib("/src/core/2d/Viewport");
let { GameState } = reqlib("/src/core/GameState");
let { Level } = reqlib("/src/core/Level");
let { CCClassicImageRenderer } = reqlib("/src/animation/renderers/image/CCClassicImageRenderer");

describe("Animator", () => {
    it("should import correctly", () => {});
    it("should render all tiles in viewport", () => {
        // set up a small level of 2x2, all floor, with player at 11
        let level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ..
            .P
        `);

        // build game state from level
        let gameState = new GameState();
        gameState.setLevel(level)

        // set up animator to render the gamestate
        let animator = new Animator(getMockCanvas());
        let stub = sinon.stub(animator, "renderTile");
        sinon.stub(animator, "renderEntity"); // don't complain about not having a renderer

        animator.renderViewport(level.getDefaultViewport(), gameState);

        // should have called renderTile 4 times, once for every tile in the level
        expect(stub.callCount).to.equal(4);
    });
    describe("integrations with renderers", () => {
        it("should call canvas drawImage with ImageRenderer", () => {
            let drawImageSpy = sinon.spy();
            let canvas = getMockCanvas(drawImageSpy);
            let animator = new Animator(canvas, new CCClassicImageRenderer(sinon.spy(), function () {}));
            let tile = new Wall();
            animator.renderTile(tile, new Coordinate(0, 0));
            expect(drawImageSpy).to.have.been.called;
        });
        it("should call canvas drawImage with renderViewport", () => {
            let drawImageSpy = sinon.spy();
            let canvas = getMockCanvas(drawImageSpy);
            let animator = new Animator(canvas, new CCClassicImageRenderer(sinon.spy(), function () {}));
            let gameState = new GameState();
            gameState.setLevel(Level.buildFromSchematic(`
                . floor
                P player-south-normal
                ===
                ..
                P.
            `));
            animator.renderViewport(gameState.viewport, gameState);
            expect(drawImageSpy).to.have.been.called;
        });
    });
});
