require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { Wall } = require("./tile/Wall");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");

let engine = GameEngine.getInstance(document);

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    engine.animator.renderTile(new Wall(renderer));
});
