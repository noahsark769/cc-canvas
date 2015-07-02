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
        return this.getLayer(layer).set((new Coordinate(x, y)).serialize(), obj);
    }
    get(x, y, layer = 1) {
        return this.getLayer(layer).get((new Coordinate(x, y)).serialize());
    }
    has(x, y, layer = 1) {
        return this.getLayer(layer).has((new Coordinate(x, y)).serialize());
    }
    delete(x, y, layer = 1) {
        return this.getLayer(layer).delete((new Coordinate(x, y)).serialize());
    }
}
