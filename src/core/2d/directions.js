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
        let index = dirs.indexOf(this.dir);
        if (index === -1) {
            console.warn("Calling clockwise could not find direction...");
        }
        return new Direction(dirs[index + 1]);
    }
    counterclockwise() {
        let dirs = ["north", "west", "south", "east", "north", "west", "south", "east"];
        let index = dirs.indexOf(this.dir);
        if (index === -1) {
            console.warn("Calling counterclockwise could not find direction...");
        }
        return new Direction(dirs[index + 1]);
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
        return "<Direction :" + this.dir + ">";
    }
    equals(other) {
        return this.dir === other.dir;
    }
    isWest() { return this.equals(new Direction(WEST)); }
    isSouth() { return this.equals(new Direction(SOUTH)); }
    isNorth() { return this.equals(new Direction(NORTH)); }
    isEast() { return this.equals(new Direction(EAST)); }

    asStringDirection() {
        return this.dir;
    }
}

Direction.south = function() { return new Direction(SOUTH); }
Direction.north = function() { return new Direction(NORTH); }
Direction.east = function() { return new Direction(EAST); }
Direction.west = function() { return new Direction(WEST); }
