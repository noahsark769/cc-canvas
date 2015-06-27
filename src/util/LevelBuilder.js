let { Level } = require("../core/Level");

class TileContext {

}

export class LevelBuilder {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    generateLevel() {
        let level = new Level(this.width, this.height);
        level.tileMap = this.tileMap;
        level.entityMap = this.entityMap;
        return level;
    }
}
