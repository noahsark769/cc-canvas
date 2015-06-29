let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { Viewport } = require("../core/2d/Viewport");
let { Coordinate } = require("../core/2d/Coordinate");
let { CoordinateTileMap } = require("../core/2d/CoordinateTileMap");

class TrapWiring {}

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateTileMap();
        this.entityMap = new CoordinateMap();
        this.initialPlayerPosition = null;
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

    setInitialPlayerPosition(position) {
        this.initialPlayerPosition = position;
    }

    getInitialPlayerPosition() {
        return this.initialPlayerPosition;
    }
}
