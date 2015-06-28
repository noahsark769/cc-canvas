let { CoordinateMap } = require("./2d/CoordinateMap");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");

export class GameState {
    constructor() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
    }

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
}
