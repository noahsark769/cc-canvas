require("babelify/polyfill");

let { GameEngine } = require("core/GameEngine");
let { Wall } = require("core/tile/Wall");

let engine = new GameEngine();

let mainRenderer = new ImageRenderer(Image, (renderer) => {
    engine.animator.renderTile(new Wall(renderer));
});
