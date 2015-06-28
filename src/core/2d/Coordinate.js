export class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    serialize() {
        return "" + this.x + "," + this.y;
    }
}

Coordinate.deserialize = function (serialized) {
    let parts = serialized.split(",");
    return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
};
