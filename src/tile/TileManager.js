let { Floor } = require("./Floor");
let { Wall } = require("./Wall");
let { Chip } = require("./Chip");

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
        this.map.set("chip", Chip);
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
