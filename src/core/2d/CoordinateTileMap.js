let {TileManager} = require("../../tile/TileManager");
let {EntityManager} = require("../../entity/EntityManager");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateTileMap extends CoordinateMap {
    constructor() {
        super();
    }

    // todo: somehow could move this into superclass??
    clone() {
        let map = new CoordinateTileMap();
        let key, value;
        for ([key, value] of this.layer1.entries()) {
            map.layer1.set(key, value);
        }
        for ([key, value] of this.layer2.entries()) {
            map.layer2.set(key, value);
        }
        return map;
    }

    newTileInstanceByName(tileName) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        if (tileClass === false) { return false; }
        let tileInstance = new tileClass();
        return tileInstance;
    }
    setTileByName(x, y, tileName, layer = 1) {
        let tileInstance = this.newTileInstanceByName(tileName);
        if (tileInstance === false) {
            // console.warn("Could not set tile " + tileName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, tileInstance, layer);
        return tileInstance;
    }
}
