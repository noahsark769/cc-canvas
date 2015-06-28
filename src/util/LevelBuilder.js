let { Level } = require("../core/Level");
let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { CoordinateTileMap } = require("../core/2d/CoordinateTileMap");
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
        this.renderer = null;
        this.tileMap = new CoordinateTileMap(this.renderer);
        this.entityMap = new CoordinateTileMap(this.renderer);
        this.defaultTileType = defaultTileType;
    }
    reset() {
        this.tileMap = new CoordinateTileMap(this.renderer);
        this.entityMap = new CoordinateTileMap(this.renderer);
    }
    setRenderer(renderer) {
        this.renderer = renderer;
    }
    setDefaultTileType(tileType) {
        this.defaultTileType = tileType;
    }
    generateLevel() {
        let level = new Level(this.width, this.height);
        level.tileMap = this.tileMap;
        level.entityMap = this.entityMap;

        if (this.defaultTileType !== null) {
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (!level.tileMap.has(i, j)) {
                        // populate with default tile type
                        level.tileMap.setTileByName(i, j, this.defaultTileType, this.renderer);
                    }
                }
            }
        }
        return level;
    }
    isOutOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }
    addTileAt(x, y, tileName) {
        this.tileMap.setTileByName(x, y, tileName);
        let context = new TileContext(this);
        context.tileName = tileName;
        context.coordinate = new Coordinate(x, y);
        return context;
    }
    addEntityAt(x, y, entityName) {
        this.entityMap.setEntityByName(x, y, entityName);
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

LevelBuilder.generateEmptyLevel = function(width, height, defaultTileType, renderer = null) {
    let builder = new LevelBuilder(width, height, defaultTileType);
    if (renderer !== null) {
        builder.setRenderer(renderer);
    }
    return builder.generateLevel();
};
