import { Coordinate } from "./Coordinate";
import { CoordinateMap } from "./CoordinateMap";

export class TwoLayerCoordinateMap {
    constructor() {
        this.layer1 = new CoordinateMap();
        this.layer2 = new CoordinateMap();
    }
    // todo: size could be interpreted to mean other things
    get size() {
        return this.layer1.size + this.layer2.size;
    }
    getLayer(layer) {
        return layer == 1 ? this.layer1 : this.layer2;
    }
    set(x, y, obj, layer = 1) {
        // console.warn("You tried to call a tile map function (set) without a layer!");
        return this.getLayer(layer).set(x, y, obj);
    }
    get(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (get) without a layer!");
        return this.getLayer(layer).get(x, y);
    }
    has(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (has) without a layer!");
        return this.getLayer(layer).has(x, y);
    }
    delete(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (delete) without a layer!");
        return this.getLayer(layer).delete(x, y);
    }
    // TODO: pretty sure this is not needed anymore??
    move(x1, y1, x2, y2, layerSource = 1, layerDest = 1) {
        let source = this.getLayer(layerSource);
        let dest = this.getLayer(layerDest);
        if (source.has(x1, y1)) {
            let obj = source.get(x1, y1);
            source.delete(x1, y1);
            // important to set AFTER delete, since source and dest could be the same thing
            dest.set(x2, y2, obj);
        }
    }
}
