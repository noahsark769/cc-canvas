export const NORTH = "north";
export const SOUTH = "south";
export const EAST = "east";
export const WEST = "west";

/**
 * A class representing a north, south, east, or west direction. Note that a direction in the game
 * corresponds 1:1 with left, right, up, down. Note: you shouldn't need to instantiate this class
 * on your own. Instead, use Direction.north, Direction.west, etc.
 */
export class Direction {
    constructor(dir) {
        this.dir = dir;
    }

    /**
     * Return a direction clockwise from this direction
     * @return {Direction} Direction one-step clockwise (e.g. North -> East)
     */
    clockwise() {
        let dirs = [NORTH, EAST, SOUTH, WEST, NORTH, EAST, SOUTH, WEST];
        let index = dirs.indexOf(this.dir);
        if (index === -1) {
            console.warn("Calling clockwise could not find direction...");
        }
        return new Direction(dirs[index + 1]);
    }

    /**
     * Return a direction counterclockwise from this direction.
     * @return {Direction} Direction one step clockwise (e.g. North -> West)
     */
    counterclockwise() {
        let dirs = ["north", "west", "south", "east", "north", "west", "south", "east"];
        let index = dirs.indexOf(this.dir);
        if (index === -1) {
            console.warn("Calling counterclockwise could not find direction...");
        }
        return new Direction(dirs[index + 1]);
    }

    /**
     * @return {Direction} The direction opposite this one.
     */
    opposite() {
        return this.clockwise().clockwise();
    }

    /**
     * Return a coordinate some number of steps away from another coordinate in this direction. E.g.,
     * Direction.south().coordinateFor(<1, 1>, 3) == <1, 4>
     * @param  {Coordinate} coord  Coordinate to start from
     * @param  {Int} amount Number of steps to return away from the given coordinate in this direction.
     * @return {Coordinate} The Coordinate `amount` steps away from the given coordinate in this direction.
     */
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

    /**
     * String representation of this direction.
     * @return {String}
     */
    toString() {
        return "<Direction :" + this.dir + ">";
    }

    /**
     * Return whether a given direction is the same as this one.
     * @param  {Direction} other
     * @return {Boolean}
     */
    equals(other) {
        return this.dir === other.dir;
    }

    /**
     * @return {Boolean} Whether this coordinate is west.
     */
    isWest() { return this.equals(new Direction(WEST)); }

    /**
     * @return {Boolean} Whether this coordinate is south.
     */
    isSouth() { return this.equals(new Direction(SOUTH)); }

    /**
     * @return {Boolean} Whether this coordinate is north.
     */
    isNorth() { return this.equals(new Direction(NORTH)); }

    /**
     * @return {Boolean} Whether this coordinate is east.
     */
    isEast() { return this.equals(new Direction(EAST)); }

    isVertical() {
        return this.isNorth() || this.isSouth();
    }

    isHorizontal() {
        return this.isEast() || this.isWest();
    }

    /**
     * @return {String} This direction as a string, like "north".
     */
    asStringDirection() {
        return this.dir;
    }
}

/*
   Defined directions.
 */
Direction.south = function() { return new Direction(SOUTH); }
Direction.north = function() { return new Direction(NORTH); }
Direction.east = function() { return new Direction(EAST); }
Direction.west = function() { return new Direction(WEST); }

Direction.fromControlString = function(string) {
    const char = string.charAt(0).toUpperCase();
    switch (char) {
        case "U": return Direction.north();
        case "D": return Direction.south();
        case "L": return Direction.west();
        case "R": return Direction.east();
        default: return null;
    }
}
