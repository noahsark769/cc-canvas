require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { Wall } = require("./tile/Wall");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");
let { LevelBuilder } = require("./util/LevelBuilder");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance(document);
    let simpleLevel = LevelBuilder.generateFromSchematic(`
        . tile floor
        W tile wall
        P entity player
        ===
        ..WWWWW.WWWWW..
        ..W...W.W...W..
        ..W...W.W...W..
        WWWWWWWWWWWWWWW
        W.............W
        W...W.....W...W
        WWWWW..P..WWWWW
        W.........W...W
        W...W.........W
        WWWWWWWWWWWWWWW
        ....W..W..W....
        ....W..W..W....
        ....W..W..W....
        ....W..W..W....
    `, renderer);
    engine.gameState.setLevel(simpleLevel);
    engine.startGameplay();
});
