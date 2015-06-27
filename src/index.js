require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { Wall } = require("./tile/Wall");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");

let engine = GameEngine.getInstance(document);
let builder = new LevelBuilder(3, 3);
builder.addTileAt(0, 0, "wall").addTileRight().addTileRight()
    .addTileDown().addTileDown()
    .addTileLeft().addTileLeft()
    .addTileUp();
let simpleLevel = builder.generateLevel();

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    engine.animator.renderViewport(simpleLevel.getDefaultViewport());
});
