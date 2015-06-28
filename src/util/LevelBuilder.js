let { Level } = require("../core/Level");
let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { TileManager } = require("../tile/TileManager");

class TileContext {

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
    }
}
