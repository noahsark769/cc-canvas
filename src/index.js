require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { Wall } = require("./tile/Wall");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");
let { LevelBuilder } = require("./util/LevelBuilder");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance(document);
    let builder = new LevelBuilder(3, 3);
    builder.setRenderer(renderer);
    builder.setDefaultTileType("floor");
    builder.addTileAt(0, 0, "wall").addTileRight().addTileRight().addTileRight()
        .addTileDown().addTileDown().addTileDown()
        .addTileLeft().addTileLeft().addTileLeft()
        .addTileUp().addTileUp();
        // .addEntityAt(1, 1, "player");
    let simpleLevel = builder.generateLevel();
    engine.startGameplay();
});
