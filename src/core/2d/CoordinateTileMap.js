let {TileManager} = require("../../tile/TileManager");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateTileMap extends CoordinateMap {
    constructor(renderer = null) {
        super();
        this.renderer = renderer;
    }
    newTileInstanceByName(tileName, renderer) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        let tileInstance = new tileClass(renderer);
        return tileInstance;
    }
    setTileByName(x, y, tileName, renderer = null) {
        if (renderer !== null) {
            renderer = this.renderer;
        }
        let tileInstance = this.newTileInstanceByName(tileName, renderer);
        this.set(x, y, tileInstance);
        return tileInstance;
    }
}
