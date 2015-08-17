import { TileManager } from "../../tile/TileManager";
import { EntityManager } from "../../entity/EntityManager";
import { TwoLayerCoordinateMap } from "./TwoLayerCoordinateMap";

export class CoordinateTileMap extends TwoLayerCoordinateMap {
    constructor() {
        super();
    }

    // todo: somehow could move this into superclass??
    clone() {
        let map = new CoordinateTileMap();
        let x, y, value;
        for ([x, y, value] of this.layer1.entries()) {
            map.set(x, y, value, 1);
        }
        for ([x, y, value] of this.layer2.entries()) {
            map.set(x, y, value, 2);
        }
        return map;
    }

    newTileInstanceByName(tileName) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        if (tileClass === false) { return false; }
        let tileInstance = new tileClass();
        return tileInstance;
    }

    setTileByName(x, y, tileName, layer) {
        if (!layer) { console.warn("You tried to call setTileByName without a layer!!"); }
        let tileInstance = this.newTileInstanceByName(tileName);
        if (tileInstance === false) {
            // console.warn("Could not set tile " + tileName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, tileInstance, layer);
        return tileInstance;
    }
}
