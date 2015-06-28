let { Floor } = require("./Floor");
let { Wall } = require("./Wall");

let INSTANCE = null;

export class TileManager {
    constructor() {
        this.map = null;
    }

    buildTileMap() {
        if (this.map !== null) { return; }
        this.map = new Map();

        this.map.set("floor", Floor);
        this.map.set("wall", Wall);
    }

    tileClassByName(name) {
        this.buildTileMap();
        return this.map.get(name);
    }
};

TileManager.getInstance = function() {
    if (INSTANCE !== null) { return INSTANCE; }
    INSTANCE = new TileManager();
    return INSTANCE;
};
