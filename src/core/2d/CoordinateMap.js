let { Coordinate } = require("./Coordinate");

export class CoordinateMap {
    constructor() {
        this.layer1 = new Map();
        this.layer2 = new Map();
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
        return this.getLayer(layer).set((new Coordinate(x, y)).serialize(), obj);
    }
    get(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (get) without a layer!");
        return this.getLayer(layer).get((new Coordinate(x, y)).serialize());
    }
    has(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (has) without a layer!");
        return this.getLayer(layer).has((new Coordinate(x, y)).serialize());
    }
    delete(x, y, layer = 1) {
        // console.warn("You tried to call a tile map function (delete) without a layer!");
        return this.getLayer(layer).delete((new Coordinate(x, y)).serialize());
    }
    move(x1, y1, x2, y2, layerSource = 1, layerDest = 1) {
        let source = this.getLayer(layerSource);
        let dest = this.getLayer(layerDest);
        if (source.has((new Coordinate(x1, y1)).serialize())) {
            let obj = source.get((new Coordinate(x1, y1)).serialize());
            source.delete((new Coordinate(x1, y1)).serialize());
            // important to set AFTER delete, since source and dest could be the same thing
            dest.set((new Coordinate(x2, y2)).serialize(), obj);
        }
    }
}
