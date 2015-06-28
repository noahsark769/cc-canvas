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
    }
    setRenderer(renderer) {
        this.renderer = renderer;
    }
    generateLevel() {
        let level = new Level(this.width, this.height);
        level.tileMap = this.tileMap;
        level.entityMap = this.entityMap;
        return level;
    }
    reset() {
        this.tileMap = new CoordinateMap();
        this.entityMap = new CoordinateMap();
    }
    addTileAt(x, y, tileName) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        let tileInstance = new tileClass(this.renderer);
        this.tileMap.set(x, y, tileInstance);
        let context = new TileContext(this);
        context.tileName = tileName;
        context.coordinate = new Coordinate(x, y);
        return context;
    }
}
