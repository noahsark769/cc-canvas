let { Level } = require("../core/Level");
let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { CoordinateTileMap } = require("../core/2d/CoordinateTileMap");
let { CoordinateEntityMap } = require("../core/2d/CoordinateEntityMap");
let { Coordinate } = require("../core/2d/Coordinate");

class TileContext {
    constructor(levelBuilder) {
        this.levelBuilder = levelBuilder;
        this.tileName = null;
        this.coordinate = null;
    }
    addTileDirection(tileName, functionName) {
        if (tileName !== null) {
            this.tileName = tileName;
        }
        this.coordinate = this.coordinate[functionName]();
        this.levelBuilder.addTileAt(
            this.coordinate.x,
            this.coordinate.y,
            this.tileName
        );
        return this;
    }
    addTileRight(tileName = null) {
        return this.addTileDirection(tileName, "rightFrom");
    }
    addTileLeft(tileName = null) {
        return this.addTileDirection(tileName, "leftFrom");
    }
    addTileUp(tileName = null) {
        return this.addTileDirection(tileName, "upFrom");
    }
    addTileDown(tileName = null) {
        return this.addTileDirection(tileName, "downFrom");
    }
}

export class LevelBuilder {
    constructor(width, height, defaultTileType = null) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateTileMap();
        this.entityMap = new CoordinateEntityMap();
        this.defaultTileType = defaultTileType;
        this.playerPosition = null;
        this.chips = 0;
    }
    reset() {
        this.tileMap = new CoordinateTileMap();
        this.entityMap = new CoordinateEntityMap();
    }
    setDefaultTileType(tileType) {
        this.defaultTileType = tileType;
    }
    generateLevel() {
        let level = new Level(this.width, this.height);
        level.tileMap = this.tileMap;
        level.entityMap = this.entityMap;
        level.chips = this.chips;
        level.chipsNeeded = this.chips;

        if (this.defaultTileType !== null) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (!level.tileMap.has(i, j)) {
                        // populate with default tile type
                        level.tileMap.setTileByName(i, j, this.defaultTileType);
                    }
                }
            }
        }
        if (this.playerPosition !== null) {
            level.setInitialPlayerPosition(this.playerPosition);
        }
        return level;
    }
    isOutOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }
    addTileAt(x, y, tileName) {
        this.tileMap.setTileByName(x, y, tileName);
        if (tileName === "chip") {
            this.chips++;
        }
        let context = new TileContext(this);
        context.tileName = tileName;
        context.coordinate = new Coordinate(x, y);
        return context;
    }
    addEntityAt(x, y, entityName) {
        this.entityMap.setEntityByName(x, y, entityName);
        if (entityName === "player") {
            this.playerPosition = new Coordinate(x, y);
        }
    }
    hasTileAt(x, y) {
        if (this.isOutOfBounds(x, y)) {
            return false;
        }
        if (this.defaultTileType !== null) {
            return true;
        }
        return this.tileMap.has(x, y);
    }
    getTileAt(x, y) {
        if (!this.isOutOfBounds(x, y) && !this.tileMap.has(x, y) && this.defaultTileType !== null) {
            return this.tileMap.newTileInstanceByName(this.defaultTileType);
        }
        return this.tileMap.get(x, y);
    }
}

LevelBuilder.generateEmptyLevel = function(width, height, defaultTileType) {
    let builder = new LevelBuilder(width, height, defaultTileType);
    return builder.generateLevel();
};

LevelBuilder.buildFromSchematic = function(schematic) {
    let builder = new LevelBuilder(0, 0);
    let [frontmatter, levelSchematic] = schematic.split("===");
    frontmatter = frontmatter.split("\n").filter((item) => { return item.length > 0; });
    frontmatter = frontmatter.map((value) => { return value.trim(); });

    let charToTileType = new Map();
    let charToEntityType = new Map()
    for (let definition of frontmatter) {
        let [char, type, name] = definition.split(" ").filter((item) => { return item.length > 0; });
        if (type == "tile") {
            charToTileType.set(char, name);
        } else {
            charToEntityType.set(char, name);
        }
    }

    let rows = levelSchematic.split("\n").map((value) => { return value.trim(); }).filter((item) => { return item.length > 0; })
    let maxX = 0, maxY = 0;
    for (let j in rows) {
        let line = rows[j];
        for (let i in line) {
            maxX = Math.max(maxX, i);
            maxY = Math.max(maxY, j);
            let char = rows[j][i];
            if (charToTileType.has(char)) {
                builder.addTileAt(i, j, charToTileType.get(char));
            }
            if (charToEntityType.has(char)) {
                if (charToEntityType.get(char).indexOf("player") !== -1) {
                    builder.addTileAt(i, j, "floor");
                }
                builder.addEntityAt(i, j, charToEntityType.get(char));
            }
        };
    };
    builder.width = maxX + 1;
    builder.height = maxY + 1;
    return builder;
}

LevelBuilder.generateFromSchematic = function(schematic) {
    let builder = LevelBuilder.buildFromSchematic(schematic);
    return builder.generateLevel();
}
