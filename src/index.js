require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { Wall } = require("./tile/Wall");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");
let { LevelBuilder } = require("./util/LevelBuilder");
let { LevelSet } = require("./core/LevelSet");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance(document, null, true);
    let builder1 = LevelBuilder.buildFromSchematic(`
        . tile floor
        W tile wall
        P entity player
        C tile chip
        E tile escape
        S tile socket
        1 tile key_green
        2 tile key_yellow
        3 tile key_red
        4 tile key_blue
        B tile door_blue
        G tile door_green
        R tile door_red
        Y tile door_yellow
        ===
        ..WWWWW.WWWWW..
        ..W...WWW...W..
        ..W.C.WEW.C.W..
        WWWWWGW.WGWWWWW
        W.2.B.....R.2.W
        W.C.W4...3W.C.W
        WWWWWC.P.CWWWWW
        W.C.W4...3W.C.W
        W...R..C..B...W
        WWWWWWYWYWWWWWW
        ....W..W..W....
        ....W.CWC.W....
        ....W..W1.W....
        ....WWWWWWW....
    `, renderer);
    let builder2 = LevelBuilder.buildFromSchematic(`
        . tile floor
        W tile wall
        P entity player
        C tile chip
        E tile escape
        ===
        ...WWWW...
        ...WCCW...
        ...WCCW...
        ...W.PW...
        ...W..W...
        ...WE.W...
        ...W..W...
        ...W..W...
        ...WWWW...
    `, renderer);
    let set = new LevelSet([
        builder1.generateLevel(),
        builder2.generateLevel()
    ]);
    engine.loadLevelSet(set);
});
