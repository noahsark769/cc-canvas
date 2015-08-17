let { Coordinate } = require("./2d/Coordinate");
let { ObjectLinkedList } = require("../util/ObjectLinkedList");
let { CoordinateTileMap } = require("./2d/CoordinateTileMap");
let { CoordinateMap } = require("./2d/CoordinateMap");
let { Viewport } = require("./2d/Viewport");
let { Player } = require("../entity/Player");
let { Direction } = require("./2d/directions");
let { EntityManager } = require("../entity/EntityManager");

export class GameState {
    constructor(engine, level) {
        this.reset();
        if (level) {
            this.setLevel(level);
        }
        this.engine = engine;
        this.DEBUG = false;
    }

    reset() {
        this.player = null;
        this.tileMap = new CoordinateTileMap();
        // exact proxy to the level, nothing else
        this.monsterList = new ObjectLinkedList("monsters");
        this.blockMap = new CoordinateMap();
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
        // TODO: go through, set monster list and player, etc
        this.level = level;
        this.tileMap = this.level.tileMap.clone();
        this.viewport = this.level.getDefaultViewport();
        this.chipsLeft = this.level.chipsNeeded;

        // init monsters
        for (let coord of this.level.movements) {
            let tile = this.tileMap.get(coord.x, coord.y, 1); // only check the top level for monsters: http://chipschallenge.wikia.com/wiki/Monster_list
            if (tile) {
                let [name, dir] = tile.name.split("-");
                let entityClass = EntityManager.getInstance().entityClassByName(name);
                if (entityClass) {
                    let entityInstance = new entityClass(new Direction(dir), coord);
                    this.monsterList.append(entityInstance);
                } else {
                    console.warn("The entity class could not be found in manager for name " + name);
                }
            } else {
                console.warn("You tried to set a movement on a tile with no monster on it...");
            }
        }

        // init player
        let playerCoord = this.level.getInitialPlayerPosition();
        let playerTile = this.tileMap.get(playerCoord.x, playerCoord.y, 1);
        if (playerTile && playerTile.name.indexOf("player") !== -1) {
            let [name, dir, state] = playerTile.name.split("-");
            this.player = new Player(state, new Direction(dir), playerCoord);
        } else {
            console.warn("You tried to make a player without a player tile. I'm gunna put it at 0, 0 south.");
            this.player = new Player("normal", Direction.south(), playerCoord);
        }
        this.viewport = Viewport.constructFromPlayerPosition(playerCoord, this.level.width, this.level.height);
    }

    getPlayerPosition() {
        return this.player.position;
    }

    // for resetting to south after three ticks
    updatePlayerTile() {
        this.tileMap.set(this.player.position.x, this.player.position.y, this.player.getTile(), 1)
    }

    movePlayerByDirection(direction) {
        let prevPlayerPosition = this.player.position;
        let newCoord = this.player.chooseMove(direction, this);
        if (newCoord) {
            this.player.move(direction, newCoord, this);
            if (direction.isSouth() && prevPlayerPosition.y >= this.viewport.getCenter().y) {
                this.viewport.shiftDownBounded(1, this.level.height);
            } else if (direction.isNorth() && prevPlayerPosition.y <= this.viewport.getCenter().y) {
                this.viewport.shiftUpBounded(1, -1);
            } else if (direction.isWest() && prevPlayerPosition.x <= this.viewport.getCenter().x) {
                this.viewport.shiftLeftBounded(1, -1);
            } else if (direction.isEast() && prevPlayerPosition.x >= this.viewport.getCenter().x) {
                this.viewport.shiftRightBounded(1, this.level.width);
            }
        }
    }

    movePlayer(controlString) {
        for (let char of controlString) {
            switch (char.toUpperCase()) {
                case "U":
                    this.movePlayerByDirection(Direction.north());
                    break;
                case "R":
                    this.movePlayerByDirection(Direction.east());
                    break;
                case "L":
                    this.movePlayerByDirection(Direction.west());
                    break;
                case "D":
                    this.movePlayerByDirection(Direction.south());
                    break;
                default:
            }
        }
    }

    advanceEntities() {
        for (let entity of this.monsterList.objects()) {
            let [newCoord, newDir] = entity.chooseMove(this);

            if (newCoord) {
                entity.advance(newDir, newCoord, this);
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

    hasPlayerAt(x, y) {
        return this.player.position.equals(new Coordinate(x, y));
    }
    getEntityAt(x, y) {
        for (let entity of this.monsterList.objects()) {
            if (entity.position.equals(new Coordinate(x, y))) {
                return entity;
            }
        }
        return false;
    }

    getTileAt(x, y) {
        if (this.tileMap.has(x, y, 1)) {
            return this.tileMap.get(x, y, 1);
        }
        return this.tileMap.get(x, y, 2);
    }
}
