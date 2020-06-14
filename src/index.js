require("babelify/polyfill");

let { GameEngine } = require("./core/GameEngine");
let { LevelSet } = require("./core/LevelSet");
let { Level } = require("./core/Level");
let { DocumentInterface } = require("./core/DocumentInterface");
let { Animator } = require("./animation/Animator");
let { CCClassicImageRenderer } = require("./animation/renderers/image/CCClassicImageRenderer");

let mainRenderer = new CCClassicImageRenderer(Image, (renderer) => {
    let engine = GameEngine.getInstance();
    let di = new DocumentInterface(window).register(engine);
    engine.animator = new Animator(di.getCanvas(), renderer);
    engine.loadLevelSet(new LevelSet([
    Level.buildFromSchematic(`
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
        T teeth-south
        S socket
        E escape
        P player-south-normal
        C chip
        ===
        .WCCCW.C.T.C..SE
        .F.W.G.CCCCC...S
        W.....W.........
        ..WCWC.O.CWbWW.C
        WW...W.W....p..C
        ..W.WwC.Wo..WW.C
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
        11 3
        12 4
        9 5
    `),
    Level.buildFromSchematic(`
        . floor
        P player-south-normal
        T teeth-west
        W wall
        E escape
        C chip
        S socket
        ===
        P....W.CW
        .WWWC..W.
        .CW...W..
        W...W.TSE
        WW.WWW.WW
        W..WWW.WW
        W....C.WW
        WWWWWWWWW
        ===
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        ===
        6 3
    `),
    Level.buildFromSchematic(`
        . floor
        P player-south-normal
        B bug-north
        W wall
        E escape
        C chip
        S socket
        ===
        PCCCCCSEW
        BWWWWWWWW
        WWWWWWWWW
        WWWWWWWWW
        WWWWWWWWW
        WWWWWWWWW
        WWWWWWWWW
        WWWWWWWWW
        ===
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        .........
        ===
        0 1
    `),
    Level.buildFromSchematic(`
        . floor
        P player-south-normal
        O ball-east
        W wall
        E escape
        C cement
        B block_mystery_fake
        b block_mystery_real
        ===
        ....bbbbb
        ....BBBBB
        ....CCCCP
        .O.......
        ....CCCCE
        ....bbbbb
        ....BBBBB
        ....WWWWW
        ===
        .........
        .........
        .........
        ........W
        .........
        .........
        .........
        .........
        ===
        1 3
    `),
    Level.buildFromSchematic(`
        . floor
        - thin_top
        ] thin_right
        [ thin_left
        _ thin_bottom
        P player-south-normal
        J thin_lr
        W wall
        E escape
        @ block
        ===
        P.].[.W
        .@....W
        _.-.J.W
        .....EW
        WWWWWWW
    `),
    Level.buildFromSchematic(`
        . floor
        P player-south-normal
        I ice
        / ice_ul
        > ice_ll
        ^ ice_lr
        < ice_ur
        B block
        W wall
        ===
        WWWWWWWW
        W/IIIBPW
        W>II<..W
        W./II<IW
        W.>I^IIW
        W/III^IW
        W>IIII^W
        WWWWWWWW
    `),
    Level.buildFromSchematic(`
        P player-south-normal
        . floor
        T toggle_closed
        t toggle_open
        g button_green
        @ block
        ===
        Pt@g
        ===
        ..W.
    `),
    Level.buildFromSchematic(`
        P player-south-normal
        . floor
        > force_right
        < force_left
        _ force_down
        ^ force_up
        @ block
        ===
        ._<<<<..
        ._.P.^..
        ._..@...
        ._....^.
        ._....^.
        ._....^.
        .>>>>>^.
        ........
    `)
    ]));
});
