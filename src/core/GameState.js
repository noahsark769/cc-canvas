let { Coordinate } = require("./2d/Coordinate");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");

export class GameState {
    constructor() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        // exact proxy to the level, nothing else
        this.entityMap = new CoordinateTileMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
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
        this.playerPosition = newCoord;
    }

    movePlayerByTransform(functionName) {
        let newCoord = this.playerPosition[functionName]();
        this.setPlayerPosition(...newCoord.asArray());
    }

    movePlayerDown() { return this.movePlayerByTransform("downFrom"); }
    movePlayerUp() { return this.movePlayerByTransform("upFrom"); }
    movePlayerLeft() { return this.movePlayerByTransform("leftFrom"); }
    movePlayerRight() { return this.movePlayerByTransform("rightFrom"); }

    setLevel(level) {
        this.level = level;
        this.entityMap = this.level.entityMap;
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
        return this.level.getDefaultViewport();
    }
}
