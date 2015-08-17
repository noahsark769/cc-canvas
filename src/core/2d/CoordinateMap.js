import { Coordinate } from "./Coordinate";

export class CoordinateMap {
    constructor() {
        this.map = new Map();
    }
    // todo: size could be interpreted to mean other things
    get size() {
        return this.map.size;
    }
    set(x, y, obj) {
        return this.map.set((new Coordinate(x, y)).serialize(), obj);
    }
    get(x, y) {
        return this.map.get((new Coordinate(x, y)).serialize());
    }
    has(x, y, layer = 1) {
        return this.map.has((new Coordinate(x, y)).serialize());
    }
    delete(x, y, layer = 1) {
        return this.map.delete((new Coordinate(x, y)).serialize());
    }
    // TODO: doesn't try to deep clone the objects, lol
    clone() {
        let cloned = new CoordinateMap();
        for (let [x, y, obj] of this.entries()) {
            cloned.set(x, y, obj);
        }
        return cloned;
    }
    *entries() {
        let coord;
        for (var [key, val] of this.map.entries()) {
            coord = Coordinate.deserialize(key);
            yield [coord.x, coord.y, val];
        }
    }
}
