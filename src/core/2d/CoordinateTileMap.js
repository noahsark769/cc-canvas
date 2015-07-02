let {TileManager} = require("../../tile/TileManager");
let {EntityManager} = require("../../entity/EntityManager");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateTileMap extends CoordinateMap {
    constructor() {
        super();
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
