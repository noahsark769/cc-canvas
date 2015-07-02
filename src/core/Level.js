let { CoordinateMap } = require("../core/2d/CoordinateMap");
let { Viewport } = require("../core/2d/Viewport");
let { Coordinate } = require("../core/2d/Coordinate");
let { CoordinateTileMap } = require("../core/2d/CoordinateTileMap");
let { CoordinateEntityMap } = require("../core/2d/CoordinateEntityMap");

class TrapWiring {}

export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new CoordinateTileMap();
        this.entityMap = new CoordinateEntityMap();
        this.initialPlayerPosition = null;
        this.chips = 0;
        this.chipsNeeded = 0;
        this.title = "";
        this.hint = "";
        this.password = "";
        this.timeLimit = 0;
        this.levelNumber = 0;
    }

    // will eventually render differently based on player position. for now, just render upper left.
    getDefaultViewport() {
        return Viewport.constructFromPlayerPosition(this.initialPlayerPosition, this.width, this.height);
    }

    setInitialPlayerPosition(position) {
        this.initialPlayerPosition = position;
    }

    getInitialPlayerPosition() {
        return this.initialPlayerPosition;
    }
}
