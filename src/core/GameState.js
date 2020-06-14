import { Coordinate } from "./2d/Coordinate";
import { ObjectLinkedList } from "../util/ObjectLinkedList";
import { CoordinateTileMap } from "./2d/CoordinateTileMap";
import { CoordinateMap } from "./2d/CoordinateMap";
import { TwoLayerCoordinateMap } from "./2d/TwoLayerCoordinateMap";
import { Viewport } from "./2d/Viewport";
import { Player, PlayerSlipType } from "../entity/Player";
import { Direction } from "./2d/directions";
import { EntityManager } from "../entity/EntityManager";
import { Block } from "../entity/Block";

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
        this.slipList = new ObjectLinkedList("slipping");
        this.slipDirections = new Map();
        this.blockMap = new TwoLayerCoordinateMap();
        this.toggleWallMap = new CoordinateMap();
        this.needsWallToggle = null;
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

        this.boots = {
            fire: false,
            water: false,
            force: false,
            ice: false
        };
    }

    setLevel(level) {
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

        // init blocks
        for (let [blockCoord, layer] of this.level.blockCoordinates) {
            let newBlock = new Block(null, blockCoord);
            this.blockMap.set(blockCoord.x, blockCoord.y, newBlock, layer);
            let tile = this.tileMap.get(blockCoord.x, blockCoord.y, layer);
            if (tile.name !== "block") { console.warn("You tried to put a block entity over a non-block tile!"); }
            tile.entity = newBlock;
        }

        // init toggle walls
        for (let [x, y, firstLayerTile] of this.tileMap.entries(1)) {
            if (firstLayerTile.name.indexOf("toggle") !== -1) {
                this.toggleWallMap.set(x, y, 1);
            }
        }
    }

    getPlayerPosition() {
        return this.player.position;
    }

    // for resetting to south after three ticks
    updatePlayerTile() {
        this.tileMap.set(this.player.position.x, this.player.position.y, this.player.getTile(), 1)
    }

    /**
     * Move the player to the given coordiante, taking care of anything else about the game state
     * which needs to change (including viewport, etc). Note that this does not account for whether
     * or not the player is actually allowed to move to the given coordinate. That check should be
     * performed by the caller.
     * @param  {Coordinate} newCoord The coordinate to move to
     * @param {Direction} direction The direction to move in
     * @param {Coordinate} prevPlayerPosition The position the player was in before the move.
     */
    movePlayerToCoordinate(newCoord, direction, prevPlayerPosition) {
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

    /**
     * Move the player in a given direction,
     * @param  {[type]} direction [description]
     * @return {[type]}           [description]
     */
    movePlayerByDirection(direction) {
        let prevPlayerPosition = this.player.position;
        let newCoord = this.player.chooseMove(direction, this);
        if (newCoord) {
            this.movePlayerToCoordinate(newCoord, direction, prevPlayerPosition);
        }
    }

    /**
     * Move player based on a control string, like "lrduurdu", etc.
     * @param  {String} controlString
     */
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

    /**
     * If the player is not slipping, do nothing. Otherwise, move the player based on the slip direction.
     * @param {String|null} The direction that the player was requested to move in for this tick. This
     *   function can process that direction to move the player if it can step off a force floor, etc.
     * @param {Boolean} playerMovedByInputOnLastTick Whether the player was moved by user input on last tick.
     *   This is provided so we can make sure the player can't immediately step onto a sliding surface then
     *   cancel out sideways the next tick.
     */
    movePlayerBySlip(requestedPlayerMovement, playerMovedByInputOnLastTick) {
        if (!this.player.isSlipping() || !this.player.slipDirection) {
            console.warn("Tried to slip a player when it was not slipping!");
            return;
        }
        let prevPlayerPosition = this.player.position;
        let newCoordForSlip = this.player.chooseMove(this.player.slipDirection, this);

        if (!playerMovedByInputOnLastTick && this.player.slipType.shouldAllowPlayerToCancelSideways() && requestedPlayerMovement !== null) {
            this.movePlayer(requestedPlayerMovement);
        } else if (newCoordForSlip) {
            this.movePlayerToCoordinate(newCoordForSlip, this.player.slipDirection, prevPlayerPosition); // this will take care of whether or not they should slip
        } else if (this.player.slipType.shouldBounceBackward()) {
            this.player.slipDirection = this.player.slipDirection.opposite();
            let oppositeCoord = this.player.chooseMove(this.player.slipDirection, this);
            if (oppositeCoord) {
                this.movePlayerToCoordinate(oppositeCoord, this.player.slipDirection, prevPlayerPosition);
            }
        }
    }

    /**
     * Return whether the player should slip this tick.
     */
    shouldSlipPlayer() {
        return this.player && this.player.isSlipping();
    }

    /**
     * Advance all entites (those slipping and optionally those not slipping).
     * @param includeNonSlipping {Boolean} Whether to advance entities which are not
     * slipping.
     */
    advanceEntities(includeNonSlipping) {
        let entityIdsOriginallyInSlipList = Array.from(this.slipList.objects()).map(function (e) { return e.id; });
        this.advanceSlippingEntities();
        if (includeNonSlipping) {
            for (let entity of this.monsterList.objects()) {
                if (entityIdsOriginallyInSlipList.indexOf(entity.id) !== -1) {
                    continue;
                }
                let [newCoord, newDir] = entity.chooseMove(this);

                if (newCoord) {
                    entity.advance(newDir, newCoord, this);
                }
            }
        }
    }

    /**
     * Advance all entities that are slipping by one move.
     */
    advanceSlippingEntities() {
        for (let entity of this.slipList.objects()) {
            let slipDirection = this.slipDirections.get(entity.id);
            if (!slipDirection) {
                console.warn("Entity " + entity + " had no slip direction when slipping!");
            }
            // TODO: this logic is hella dirty
            if (entity.name === "block") {
                if (entity.canMove(slipDirection, this)) {
                    entity.move(slipDirection, this);
                } else if (entity.canMove(slipDirection.opposite(), this)) {
                    entity.move(slipDirection.opposite(), this);
                }
            } else {
                let [newCoord, newDir] = entity.chooseMoveSlippingInDirection(slipDirection, this);
                if (newCoord) {
                    entity.advance(newDir, newCoord, this);
                }
            }
        }
    }

    /**
     * Set an entity to be slipping. Note that if the entity is already slipping, this
     * will have no effect except to change their slip direction (slip direction is implemented
     * differently for monsters and player).
     * @param {Entity} entity Entity to slip
     */
    setEntitySlipping(entity, direction, typeIfPlayer) {
        if (entity.name === "player") {
            entity.startSlipping(direction, typeIfPlayer);
        } else {
            if (this.slipList.contains(entity)) {
                this.slipDirections.set(entity.id, direction);
                entity.direction = direction;
                return;
            }
            // TODO: just use a SlipList object instead of having two linked lists

            // NOTE: this function can set both blocks and monsters to be slipping,
            // but only monsters should be removed from the monster list.
            if (entity.name !== "block") {
                this.monsterList.remove(entity);
            }
            this.slipList.append(entity);
            this.slipDirections.set(entity.id, direction);
            entity.direction = direction;
        }
    }

    /**
     * Return whether a given entity is slipping or not.
     */
    isEntitySlipping(entity) {
        if (entity.name === "player") {
            return this.player.isSlipping();
        } else {
            return this.slipList.contains(entity);
        }
    }

    /**
     * Set that the given entity is no longer slipping. If the entity was already not
     * slipping, this will have no effect.
     * @param {Entity} entity Entity to unslip.
     */
    setEntityNotSlipping(entity) {
        if (entity.name === "player") {
            entity.slipDirection = null;
        } else {
            if (this.monsterList.contains(entity)) {
                console.warn("Attempt to reinsert " + entity + " into the monster list when it was already there.")
                return;
            }
            // TODO: just use a SlipList object instead of having two linked lists
            this.slipList.remove(entity);

            // NOTE: this function can set both blocks and monsters to be not slipping,
            // but only monsters should be added to the monster list.
            if (entity.name !== "block") {
                this.monsterList.append(entity);
            }
            this.slipDirections.delete(entity.id);
        }
    }

    /**
     * Tell the game state that walls need to be toggled on the next tick.
     */
    requestWallToggle() {
        if (this.needsWallToggle === null) {
            this.needsWallToggle = true;
        } else {
            this.needsWallToggle = !this.needsWallToggle;
        }
    }

    /**
     * If toggle walls need to be toggled, toggle them.
     */
    toggleWallsIfNeeded() {
        if (this.needsWallToggle) {
            this.toggleWalls();
        }
        this.needsWallToggle = null;
    }

    /**
     * For every toggle wall in the current level, force it to flip its state.
     */
    toggleWalls() {
        for (let [x, y, layer] of this.toggleWallMap.entries()) {
            let toggleWallTile = this.tileMap.get(x, y, layer);
            this.tileMap.set(x, y, toggleWallTile.getToggledTile(), layer);
        }
    }

    /**
     * Advance the number of ticks in the game.
     */
    tick() {
        this.currentTicks++;
    }

    /**
     * @return {Boolean} Whether the gameState is on an even tick.
     * @todo Rename to isEven()
     */
    even() {
        return !(this.currentTicks & 1);
    }

    /**
     * @return {Boolean} Whether the gameState is on an odd tick.
     * @todo Rename to isOdd()
     */
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
