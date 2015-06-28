let { CoordinateMap } = require("../core/2d/CoordinateMap");

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateMap();
        this.entityMap = new CoordinateMap();
    }

    // will eventually render differently based on player position. for now, just render upper left.
    getDefaultViewport() {
        return Viewport.constructFromBounds(
            new Coordinate(0, 0),
            new Coordinate(8, 0),
            new Coordinate(8, 8),
            new Coordinate(0, 8)
        );
    }
}
