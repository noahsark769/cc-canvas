let { Coordinate } = require("./2d/Coordinate");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");
let { Viewport } = require("./2d/Viewport");

export class GameState {
    constructor() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        // exact proxy to the level, nothing else
        this.entityMap = new CoordinateTileMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
        this.viewport = null;
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

    movePlayerByTransform(functionName, viewportFunctionName, viewportBound) {
        let newCoord = this.playerPosition[functionName]();
        if (newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= this.level.width || newCoord.y >= this.level.height) {
            return;
        }
        if (this.hasTileAt(...newCoord.asArray())) {
            let nextTile = this.getTileAt(...newCoord.asArray());
            if (nextTile.shouldBlockPlayer()) {
                return;
            }
        }
        this.setPlayerPosition(...newCoord.asArray());
        if (viewportFunctionName) {
            this.viewport[viewportFunctionName](1, viewportBound)
        }
    }

    movePlayerDown() { return this.movePlayerByTransform("downFrom", "shiftDownBounded", this.level.height); }
    movePlayerUp() { return this.movePlayerByTransform("upFrom", "shiftUpBounded", -1); }
    movePlayerLeft() { return this.movePlayerByTransform("leftFrom", "shiftLeftBounded", -1); }
    movePlayerRight() { return this.movePlayerByTransform("rightFrom", "shiftRightBounded", this.level.width); }
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
