import { CoordinateMap } from "../core/2d/CoordinateMap";
import { Viewport } from "../core/2d/Viewport";
import { Coordinate } from "../core/2d/Coordinate";
import { CoordinateTileMap } from "../core/2d/CoordinateTileMap";
import { Block } from "../entity/Block";

class TrapWiring {} // later

function sortCompare(first, second) {
    if (first < second) {
        return -1;
    }
    if (first > second) {
        return 1;
    }
    return 0;
}

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateTileMap();
        this.movements = []; // array of coordinates indicating where the monsters are, in order
        this.blockCoordinates = []; // array of [coordinate, level] of blocks
        this.teleportTopLevelCoordinates = []; // array of coordinate of teleports
        this.teleportBottomLevelCoordinates = []; // array of coordinate of teleports
        this.chips = 0;
        this.chipsNeeded = 0;
        this.title = "";
        this.hint = "";
        this.password = "";
        this.timeLimit = 0;
        this.levelNumber = 0;
    }

    getDefaultViewport() {
        return Viewport.constructFromPlayerPosition(this.getInitialPlayerPosition(), this.width, this.height);
    }

    /**
     * From http://chipschallenge.wikia.com/wiki/Chip, "If there happen to be two or more Chip tiles
     * in a level, the "real" one is determined by the first Chip tile in reverse reading order."
     */
    getInitialPlayerPosition() {
        for (let j = this.height - 1; j >= 0; j--) {
            for (let i = this.width - 1; i >= 0; i--) {
                if (this.tileMap.has(i, j, 1) && this.tileMap.get(i, j, 1).name.indexOf("player") !== -1) {
                    return new Coordinate(i, j);
                }
            }
        }
        return new Coordinate(0, 0); // http://chipschallenge.wikia.com/wiki/Non-Existence_Glitch
    }

    addTeleportCoordinate(coordinate, level) {
        if (level === 1) {
            this.teleportTopLevelCoordinates.push(coordinate);
        } else {
            this.teleportBottomLevelCoordinates.push(coordinate);
        }
    }

    /**
     * Returns the position of the next teleport in reverse writable reading order. This does not check things
     * that need to be checked to see if an entity can move from the given position to the resulting teleport
     * position
     * @param {*} fromCoordinate 
     */
    nextEffectiveTeleportPosition(fromCoordinate) {
        let sortedTeleportCoordinates = this.teleportTopLevelCoordinates.sort((first, second) => {
            if (first[1] === second[1]) {
                return sortCompare(first[0], second[0]);
            }
            return sortCompare(first[1], second[1]);
        })
        let indexOfFromCoordinate = sortedTeleportCoordinates.findIndex((object) => {
            // console.log(`Tryna findIndex for ${object} comparing to ${fromCoordinate}`);
            return object.equals(fromCoordinate);
        });
        if (indexOfFromCoordinate === -1) {
            console.warn(`Unable to find coordinate ${fromCoordinate} in teleport sort position array ${sortedTeleportCoordinates}`);
            return null;
        }
        if (indexOfFromCoordinate === 0) {
            return sortedTeleportCoordinates[sortedTeleportCoordinates.length - 1];
        } else {
            return sortedTeleportCoordinates[indexOfFromCoordinate - 1];
        }
    }
}

Level.buildFromSchematic = function(schematic) {
    let level = new Level(0, 0);
    let [frontmatter, layer1Schematic, layer2Schematic, movementSchematic, trapWiringSchematic, cloneWiringSchematic] = schematic.split("===");
    frontmatter = frontmatter.split("\n").filter((item) => { return item.length > 0; });
    frontmatter = frontmatter.map((value) => { return value.trim(); });

    let charToTileType = new Map();
    for (let definition of frontmatter) {
        let [char, name] = definition.split(" ").filter((item) => { return item.length > 0; });
        if (charToTileType.get(char)) {
            console.warn("When building level, saw duplicate definition of " + char + " from " + charToTileType.get(char) + " to " + name);
        }
        charToTileType.set(char, name);
    }

    // calc max dimensions
    let rows = layer1Schematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; });
    let maxX = 0, maxY = 0;
    for (let j in rows) {
        let line = rows[j];
        for (let i in line) {
            maxX = Math.max(maxX, i);
            maxY = Math.max(maxY, j);
        }
    }

    // if there's no layer 2, we need to populate it with floor
    // TODO: this clobbers the ` character, we should take that out somehow
    if (!layer2Schematic) {
        charToTileType.set("`", "floor");
        let newRows = [];
        let newRow = "";
        for (let j = 0; j <= maxY; j++) {
            for (let i = 0; i <= maxX; i++) {
                newRow += "`";
            }
            newRows.push(newRow);
            newRow = "";
        }
        layer2Schematic = newRows.join("\n");
    }

    for (let [layerNum, schematic] of [[1, layer1Schematic], [2, layer2Schematic]]) {
        let rows = schematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; });
        // i corresponds to x coordinates, j to y
        for (let j in rows) {
            let line = rows[j];
            for (let i in line) {
                let char = rows[j][i];
                if (charToTileType.has(char)) {
                    level.tileMap.setTileByName(i, j, charToTileType.get(char), layerNum);
                    if (charToTileType.get(char) === "chip") {
                        level.chipsNeeded++;
                    }
                    if (charToTileType.get(char) === "block") {
                        level.blockCoordinates.push([new Coordinate(i, j), layerNum]);
                    }
                    if (charToTileType.get(char) === "teleport") {
                        level.addTeleportCoordinate(new Coordinate(i, j), layerNum);
                    }
                } else {
                    console.warn("When building level, char " + char + " could not find an associated tile type on layer " + layerNum + ".");
                }
            }
        }
    }

    if (movementSchematic) {
        let movements = movementSchematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; });
        let x, y;
        for (let movement of movements) {
            let [x, y] = movement.split(" ");
            level.movements.push(new Coordinate(x, y));
        }
    }

    // TODO: trap and clone wirings
    level.width = maxX + 1;
    level.height = maxY + 1;
    return level;
}
