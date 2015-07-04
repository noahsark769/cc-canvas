let { Coordinate } = require("./2d/Coordinate");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");
let { CoordinateEntityMap } = require("./2d/CoordinateEntityMap");
let { Viewport } = require("./2d/Viewport");
let {NORTH, SOUTH, EAST, WEST} = require("./2d/directions");

export class GameState {
    constructor(engine, level) {
        this.reset();
        this.level = level || null;
        this.engine = engine;
        this.DEBUG = false;
    }

    reset() {
        this.playerPosition = null;
        this.tileMap = new CoordinateTileMap();
        // exact proxy to the level, nothing else
        this.entityMap = new CoordinateEntityMap();
        this.level = null;
        this.currentTicks = 0; // the number of ticks since the currently playing level began
        this.viewport = null;
        this.chipsLeft = 0;

        this.isWin = false;
        this.isLoss = false;
        this.isOver = false;

        this.redKeys = 0;
        this.blueKeys = 0;
        this.yellowKeys = 0;
        this.greenKeys = 0;
    }

    setLevel(level) {
        this.level = level;
        this.entityMap = this.level.entityMap.clone();
        this.tileMap = this.level.tileMap.clone();
        if (this.level.getInitialPlayerPosition() !== null) {
            this.setPlayerPosition(...this.level.getInitialPlayerPosition().asArray());
        }
        this.viewport = this.level.getDefaultViewport();
        this.chipsLeft = this.level.chipsNeeded;
    }

    getPlayerPosition() {
        return this.playerPosition;
    }

    setPlayerPosition(x, y) {
        let newCoord = new Coordinate(x, y);
        if (this.playerPosition !== null) {
            if (this.playerPosition.isDifferentFrom(newCoord)) {
                // if (this.entityMap.has(newCoord.x, newCoord.y)) {
                //     // this is a loss!
                //     this.isOver = true;
                //     this.isLoss = true;
                //     this.entityMap.move(this.playerPosition.x, this.playerPosition.y, newCoord.x, newCoord.y, 1, 2);
                //     return;
                // } else {
                    this.entityMap.move(this.playerPosition.x, this.playerPosition.y, newCoord.x, newCoord.y);
                // }
            }
        }
        if (this.playerPosition === null && this.level !== null) {
            this.viewport = Viewport.constructFromPlayerPosition(newCoord, this.level.width, this.level.height);
        }
        this.playerPosition = newCoord;
    }

    movePlayerByTransform(functionName) {
        let newCoord = this.playerPosition[functionName]();
        if (newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= this.level.width || newCoord.y >= this.level.height) {
            return false;
        }
        if (this.hasTileAt(...newCoord.asArray())) {
            let nextTile = this.getTileAt(...newCoord.asArray());
            if (nextTile.shouldBlockPlayer(undefined, this)) { // TODO: pass in player
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
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", SOUTH, this, this.playerPosition, this.engine);
            this.getTileAt(prevPlayerPosition.x, prevPlayerPosition.y).entityWillExit("player", SOUTH, this, prevPlayerPosition, this.engine);
        }
    }

    movePlayerUp() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("upFrom") && prevPlayerPosition.y <= this.viewport.getCenter().y) {
            this.viewport.shiftUpBounded(1, -1);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", NORTH, this, this.playerPosition, this.engine);
            this.getTileAt(prevPlayerPosition.x, prevPlayerPosition.y).entityWillExit("player", NORTH, this, prevPlayerPosition, this.engine);
        }
    }

    movePlayerLeft() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("leftFrom") && prevPlayerPosition.x <= this.viewport.getCenter().x) {
            this.viewport.shiftLeftBounded(1, -1);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", WEST, this, this.playerPosition, this.engine);
            this.getTileAt(prevPlayerPosition.x, prevPlayerPosition.y).entityWillExit("player", WEST, this, prevPlayerPosition, this.engine);
        }
    }

    movePlayerRight() {
        let prevPlayerPosition = this.playerPosition;
        if (this.movePlayerByTransform("rightFrom") && prevPlayerPosition.x >= this.viewport.getCenter().x) {
            this.viewport.shiftRightBounded(1, this.level.width);
        }
        if (this.hasTileAt(this.playerPosition.x, this.playerPosition.y)) {
            this.getTileAt(this.playerPosition.x, this.playerPosition.y).entityWillOccupy("player", EAST, this, this.playerPosition, this.engine);
            this.getTileAt(prevPlayerPosition.x, prevPlayerPosition.y).entityWillExit("player", EAST, this, prevPlayerPosition, this.engine);
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

    advanceEntities() {
        for (let [entity, coordinate] of this.entityMap.entitiesInOrder()) {
            if (entity.name !== "player") {
                let [newCoord, newDir] = entity.chooseMove(this.tileMap, this.entityMap, this, coordinate);

                // if we were not able to choose a move, then don't move
                if (!newCoord) {
                    continue;
                }

                // ACTUALLY DO IT!
                this.entityMap.move(coordinate.x, coordinate.y, newCoord.x, newCoord.y);
                entity.direction = newDir;
                if (this.playerPosition) console.log("Player position is: " + this.playerPosition.serialize());
                if (this.playerPosition && this.playerPosition.equals(newCoord)) { // we moved onto the player. it's over!
                    // this is a loss!
                    this.isOver = true;
                    this.isLoss = true;
                    return;
                }
                // make sure the tile knows what's occupying it, and kill the entity if needed
                if (this.tileMap.has(newCoord.x, newCoord.y)) {
                    let isDead = this.tileMap.get(newCoord.x, newCoord.y).entityWillOccupy(entity);
                    if (isDead) { // did the monster die?
                        this.entityMap.delete(newCoord.x, newCoord.y);
                    }
                }
            }
        }
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
        if (this.tileMap.has(x, y, 1)) {
            return true;
        }
        if (this.tileMap.has(x, y, 2)) {
            return true;
        }
        return false;
    }

    hasEntityAt(x, y) { return this.entityMap.has(x, y); }
    getEntityAt(x, y) { return this.entityMap.get(x, y); }

    getTileAt(x, y) {
        if (this.tileMap.has(x, y, 1)) {
            return this.tileMap.get(x, y, 1);
        }
        return this.tileMap.get(x, y, 2);
    }

    getViewport() {
        return this.viewport;
    }
}
