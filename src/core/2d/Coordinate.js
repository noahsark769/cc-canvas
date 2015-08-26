let { Direction } = require("./directions");

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

    downFrom() { return new Coordinate(this.x, this.y + 1); }
    upFrom() { return new Coordinate(this.x, this.y - 1); }
    leftFrom() { return new Coordinate(this.x - 1, this.y); }
    rightFrom() { return new Coordinate(this.x + 1, this.y); }

    right() { return this.rightFrom(); }
    left() { return this.leftFrom(); }
    down() { return this.downFrom(); }
    up() { return this.upFrom(); }

    r() { return this.rightFrom(); }
    l() { return this.leftFrom(); }
    d() { return this.downFrom(); }
    u() { return this.upFrom(); }

    getManhattanEW(target) {
        let dir;
        if (this.x > target.x) {
            dir = Direction.west();
        } else {
            dir = Direction.east();
        }
        return [dir, Math.abs(this.x - target.x)];
    }

    getManhattanNS(target) {
        let dir;
        if (this.y > target.y) {
            dir = Direction.north();
        } else {
            dir = Direction.south();
        }
        return [dir, Math.abs(this.y - target.y)];
    }

    /**
     * Return the euclidian distance on the grid from this coordinate to the given
     * other coordinate.
     */
    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    isWithinBounds(x1, x2, y1, y2) {
        return !(this.x < x1 || this.y < y1 || this.x > x2 || this.y > y2);
    }

    isWithinBoundsOfLevel(level) {
        return this.isWithinBounds(0, level.width - 1, 0, level.height - 1);
    }

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
