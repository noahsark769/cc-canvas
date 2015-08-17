import { CoordinateMap } from "../core/2d/CoordinateMap";
import { Viewport } from "../core/2d/Viewport";
import { Coordinate } from "../core/2d/Coordinate";
import { CoordinateTileMap } from "../core/2d/CoordinateTileMap";
import { Block } from "../entity/Block";

class TrapWiring {} // later

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateTileMap();
        this.blockMap = new CoordinateMap();
        this.movements = []; // array of coordinates indicating where the monsters are, in order
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

    // TODO: DRY this up
    let rows = layer1Schematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; });
    let maxX = 0, maxY = 0;
    for (let j in rows) {
        let line = rows[j];
        for (let i in line) {
            maxX = Math.max(maxX, i);
            maxY = Math.max(maxY, j);
            let char = rows[j][i];
            if (charToTileType.has(char)) {
                level.tileMap.setTileByName(i, j, charToTileType.get(char), 1);
                if (charToTileType.get(char) === "chip") {
                    level.chipsNeeded++;
                }
                if (charToTileType.get(char) === "block") {
                    level.blockMap.set(i, j, new Block(null, new Coordinate(i, j)), 1);
                }
            } else {
                console.warn("When building level, char " + char + " could not find an associated tile type.");
            }
        };
    };

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

    rows = layer2Schematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; });
    maxX = 0, maxY = 0;
    for (let j in rows) {
        let line = rows[j];
        for (let i in line) {
            maxX = Math.max(maxX, i);
            maxY = Math.max(maxY, j);
            let char = rows[j][i];
            if (charToTileType.has(char)) {
                level.tileMap.setTileByName(i, j, charToTileType.get(char), 2);
                if (charToTileType.get(char) === "chip") {
                    level.chipsNeeded++;
                }
                if (charToTileType.get(char) === "block") {
                    level.blockMap.set(i, j, new Block(null, new Coordinate(i, j)), 2);
                }
            } else {
                console.warn("WARNING: When building level, char " + char + " could not find an associated tile type.");
            }
        };
    };

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
