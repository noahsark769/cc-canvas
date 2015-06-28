let { Level } = require("../core/Level");
let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { Coordinate } = require("../core/2d/Coordinate");
let { TileManager } = require("../tile/TileManager");

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
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateMap();
        this.entityMap = new CoordinateMap();
        this.renderer = null;
        this.defaultTileType = null;
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
                        level.tileMap.set(i, j, this.newTileInstanceByName(this.defaultTileType))
                    }
                }
            }
        }
        return level;
    }
    reset() {
        this.tileMap = new CoordinateMap();
        this.entityMap = new CoordinateMap();
    }
    isOutOfBounds(x, y) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }
    newTileInstanceByName(tileName) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        let tileInstance = new tileClass(this.renderer);
        return tileInstance;
    }
    addTileAt(x, y, tileName) {
        let tileInstance = this.newTileInstanceByName(tileName);
        this.tileMap.set(x, y, tileInstance);
        let context = new TileContext(this);
        context.tileName = tileName;
        context.coordinate = new Coordinate(x, y);
        return context;
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
            return this.newTileInstanceByName(this.defaultTileType);
        }
        return this.tileMap.get(x, y);
    }
}
