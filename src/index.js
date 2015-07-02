require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { DocumentInterface } = require("./core/DocumentInterface");
let { Animator } = require("./animation/Animator");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance();
    let di = new DocumentInterface(window).register(engine);
    engine.animator = new Animator(di.getCanvas(), renderer);
});
