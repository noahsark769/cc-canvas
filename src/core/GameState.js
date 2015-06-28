let { Coordinate } = require("./2d/Coordinate");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");

export class GameState {
    constructor() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
    }
    getPlayerPosition() {
        return this.playerPosition;
    }
    setPlayerPosition(x, y) {
        this.playerPosition = new Coordinate(x, y);
    }

    movePlayerByTransform(functionName) {
        this.playerPosition = this.playerPosition[functionName]();
    }

    movePlayerDown() { return this.movePlayerByTransform("downFrom"); }
    movePlayerUp() { return this.movePlayerByTransform("upFrom"); }
    movePlayerLeft() { return this.movePlayerByTransform("leftFrom"); }
    movePlayerRight() { return this.movePlayerByTransform("rightFrom"); }

    setLevel(level) {
        this.level = level;
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

    getTileAt(x, y) {
        if (this.tileMap.has(x, y)) {
            return this.tileMap.get(x, y);
        }
        return this.level.tileMap.get(x, y);
    }

    // for now, just return default viewport from level
    getViewport() {
        return this.level.getDefaultViewport();
    }
}
