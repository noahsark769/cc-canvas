let { CoordinateMap } = require("../core/2d/CoordinateMap");

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateMap();
        this.entityMap = new CoordinateMap();
    }
}
