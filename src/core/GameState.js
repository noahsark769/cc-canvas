let { Coordinate } = require("./2d/Coordinate");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");
let { Viewport } = require("./2d/Viewport");
let {NORTH, SOUTH, EAST, WEST} = require("./2d/directions");

export class GameState {
    constructor() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        // exact proxy to the level, nothing else
        this.entityMap = new CoordinateTileMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
        this.viewport = null;
        this.chipsLeft = 0;
    }

    getPlayerPosition() {
        return this.playerPosition;
    }

    setPlayerPosition(x, y) {
        let newCoord = new Coordinate(x, y);
        if (this.playerPosition !== null) {
            let player = this.entityMap.get(...this.playerPosition.asArray());
            this.entityMap.delete(...this.playerPosition.asArray());
            this.entityMap.set(newCoord.x, newCoord.y, player);
        }
        if (this.playerPosition === null && this.level !== null) {
            this.viewport = Viewport.constructFromPlayerPosition(newCoord, this.level.width, this.level.height);
        }
        this.playerPosition = newCoord;
    }

    movePlayerByTransform(functionName) {
        let newCoord = this.playerPosition[functionName]();
        if (newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= this.level.width || newCoord.y >= this.level.height) {
            return;
        }
        if (this.hasTileAt(...newCoord.asArray())) {
            let nextTile = this.getTileAt(...newCoord.asArray());
            if (nextTile.shouldBlockPlayer()) {
                return false;
            }
        }
        this.setPlayerPosition(...newCoord.asArray());
        return true;
    }

    movePlayerDown() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("downFrom") && prevPlayerPosition.y >= this.viewport.getCenter().y) {
            this.viewport.shiftDownBounded(1, this.level.height);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", SOUTH, this, this.playerPosition);
        }
    }
    movePlayerUp() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("upFrom") && prevPlayerPosition.y <= this.viewport.getCenter().y) {
            this.viewport.shiftUpBounded(1, -1);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", NORTH, this, this.playerPosition);
        }
    }
    movePlayerLeft() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("leftFrom") && prevPlayerPosition.x <= this.viewport.getCenter().x) {
            this.viewport.shiftLeftBounded(1, -1);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", WEST, this, this.playerPosition);
        }
    }
    movePlayerRight() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("rightFrom") && prevPlayerPosition.x >= this.viewport.getCenter().x) {
            this.viewport.shiftRightBounded(1, this.level.width);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", EAST, this, this.playerPosition);
        }
    }
    movePlayer(controlString) {
        for (let char of controlString) {
            switch (char) {
                case "U":
                    this.movePlayerUp();
                    break;
                case "R":
                    this.movePlayerRight();
                    break;
                case "L":
                    this.movePlayerLeft();
                    break;
                case "D":
                    this.movePlayerDown();
                    break;
                default:
            }
        }
    }

    setLevel(level) {
        this.level = level;
        this.entityMap = this.level.entityMap;
        if (this.level.getInitialPlayerPosition() !== null) {
            this.setPlayerPosition(...this.level.getInitialPlayerPosition().asArray());
        }
        this.viewport = this.level.getDefaultViewport();
        this.chipsLeft = this.level.chipsNeeded;
    }

    tick() {
        this.currentTicks++;
    }

    even() {
        return !(this.currentTicks & 1);
    }

    odd() {
        return this.currentTicks & 1;
    }

    hasTileAt(x, y) {
        if (this.tileMap.has(x, y)) {
            return true;
        }
        return this.level.tileMap.has(x, y);
    }

    hasEntityAt(x, y) { return this.entityMap.has(x, y); }
    getEntityAt(x, y) { return this.entityMap.get(x, y); }

    getTileAt(x, y) {
        if (this.tileMap.has(x, y)) {
            return this.tileMap.get(x, y);
        }
        return this.level.tileMap.get(x, y);
    }

    // for now, just return default viewport from level
    getViewport() {
        return this.viewport;
    }
}
