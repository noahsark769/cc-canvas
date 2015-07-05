export const NORTH = "north";
export const SOUTH = "south";
export const EAST = "east";
export const WEST = "west";

export class Direction {
    constructor(dir) {
        this.dir = dir;
    }
    clockwise() {
        let dirs = [NORTH, EAST, SOUTH, WEST, NORTH, EAST, SOUTH, WEST];
        return new Direction(dirs[dirs.indexOf(this.dir) + 1]);
    }
    counterclockwise() {
        let dirs = [NORTH, WEST, SOUTH, EAST, NORTH, WEST, SOUTH, EAST];
        return new Direction(dirs[dirs.indexOf(this.dir) + 1]);
    }
    coordinateFor(coord, amount) {
        let map = new Map();
        map.set(NORTH, "upFrom");
        map.set(SOUTH, "downFrom");
        map.set(EAST, "rightFrom");
        map.set(WEST, "leftFrom");
        let result = coord;
        for (let i = 0; i < amount; i++) {
            result = result[map.get(this.dir)]();
        }
        return result;
    }
    toString() {
        return this.dir;
    }
    equals(other) {
        return this.dir === other.dir;
    }
    isWest() { return this.equals(new Direction(WEST)); }
    isSouth() { return this.equals(new Direction(SOUTH)); }
    isNorth() { return this.equals(new Direction(NORTH)); }
    isEast() { return this.equals(new Direction(EAST)); }
}

Direction.south = function() { return new Direction(SOUTH); }
Direction.north = function() { return new Direction(NORTH); }
Direction.east = function() { return new Direction(EAST); }
Direction.west = function() { return new Direction(WEST); }
