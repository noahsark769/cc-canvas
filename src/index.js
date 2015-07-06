require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { LevelSet } = require("./core/LevelSet");
let { DocumentInterface } = require("./core/DocumentInterface");
let { Animator } = require("./animation/Animator");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance();
    let di = new DocumentInterface(window).register(engine);
    engine.animator = new Animator(di.getCanvas(), renderer);
    engine.loadLevelSet(LevelSet.fromSchematic(`
        . floor
        W wall
        F fireball-east
        G glider-west
        p paramecium-east
        b bug-south
        O ball-east
        o ball-south
        w walker-east
        B blob-east
        T teeth
        S socket
        E escape
        P player-south-normal
        C chip
        ===
        .WCCCW.C.T.C..SE
        .F.W.G.CCCCC...S
        W.....W.........
        ..WCWC.O.CbWWW.C
        WW...W.W....p..C
        ..W.Ww..Wo.WWW.C
        B.WWW...W......P
        WWWWWWWWWWWWWWWW
        WWWWWWWWWWWWWWWW
        ===
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ................
        ===
        1 1
        5 1
        0 6
        5 5
        9 0
        7 3
        10 3
        12 4
        9 5
    `));
});
