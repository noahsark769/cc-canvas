export class Coordinate {
    constructor(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    serialize() {
        return "" + this.x + "," + this.y;
    }

    isDifferentFrom(other) {
        return this.x !== other.x || this.y !== other.y;
    }

    equals(other) {
        return !this.isDifferentFrom(other);
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

    right() { return this.rightFrom(); }
    left() { return this.leftFrom(); }
    down() { return this.downFrom(); }
    up() { return this.upFrom(); }

    r() { return this.rightFrom(); }
    l() { return this.leftFrom(); }
    d() { return this.downFrom(); }
    u() { return this.upFrom(); }

    asArray() {
        return [this.x, this.y];
    }

    toString() {
        return "<Coordinate: " + this.x + ", " + this.y + ">";
    }
}

Coordinate.deserialize = function (serialized) {
    let parts = serialized.split(",");
    return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
};
