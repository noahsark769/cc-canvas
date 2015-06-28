let { Coordinate } = require("./Coordinate");

export class CoordinateMap {
    constructor() {
        this.map = new Map();
    }
    get size() {
        return this.map.size;
    }
    set(x, y, obj) {
        return this.map.set((new Coordinate(x, y)).serialize(), obj);
    }
    get(x, y) {
        return this.map.get((new Coordinate(x, y)).serialize());
    }
    has(x, y) {
        return this.map.has((new Coordinate(x, y)).serialize());
    }
    delete(x, y) {
        return this.map.delete((new Coordinate(x, y)).serialize());
    }
}
