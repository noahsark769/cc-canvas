export class Coordinate {
    constructor(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    serialize() {
        return "" + this.x + "," + this.y;
    }

    downFrom() {
        return new Coordinate(this.x, this.y + 1);
    }

    upFrom() {
        return new Coordinate(this.x, this.y - 1);
    }

    leftFrom() {
        return new Coordinate(this.x - 1, this.y)
    }

    rightFrom() {
        return new Coordinate(this.x + 1, this.y)
    }

    asArray() {
        return [this.x, this.y];
    }
}

Coordinate.deserialize = function (serialized) {
    let parts = serialized.split(",");
    return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
};
