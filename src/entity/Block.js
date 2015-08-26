import { Entity } from "./Entity";
import { Tile } from "../tile/Tile";

export class Block extends Entity {
    constructor(...args) {
        super(...args);
        this.name = "block";
    }
    canMove(direction, gameState) {
        // block's direction is null unless sliding
        // this method determines whether the block can be pushed in the given direction
        let target = direction.coordinateFor(this.position, 1);
        if (!target.isWithinBoundsOfLevel(gameState.level)) { return false; }

        let targetTileUpper = gameState.tileMap.get(target.x, target.y, 1);
        let targetTileLower = gameState.tileMap.get(target.x, target.y, 2);
        let thisTileLower = gameState.tileMap.get(this.position.x, this.position.y, 2);
        if (
            (targetTileUpper && targetTileUpper.shouldBlockEntity(this, direction, gameState)) ||
            ((!targetTileUpper || targetTileUpper.isTransparent()) && targetTileLower && targetTileLower.shouldBlockEntity(this, direction, gameState)) ||
            (thisTileLower && thisTileLower.shouldBlockEntityExit(this, direction, gameState))
        ) {
            return false;
        }
        return true;
    }
    // this should NEVER be called if the block tile is on the lower layer!!
    move(direction, gameState) {
        let target = direction.coordinateFor(this.position, 1);
        this.performMove(target, direction, gameState);
        gameState.blockMap.delete(this.position.x, this.position.y, 1);
        gameState.blockMap.set(target, target, this, 1);
        this.position = target;
    }
    getTile() {
        let tile = new BlockTile();
        tile.entity = this;
        return tile;
    }
}

export class BlockTile extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "block";
    }
    setEntity(entity) {
        this.entity = entity;
    }
    getEntity(gameState) {
        if (!this.entity) { console.warn("You tried to get the entity of a block but it hasn't been set!!"); }
        return this.entity;
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player") {
            // kinda hacky: we assume that a player will only ever check this if
            // they want to move there. TODO: figure out a more robust way to do this.
            if (this.getEntity().canMove(direction, gameState)) {
                this.getEntity().move(direction, gameState);
                return false;
            }
        }
        if (entity.name === "block") {
            return this.getEntity().canMove(direction, gameState);
        }
        return true;
    }
    entityShouldReplace() {
        return true;
    }
    entityWillUnpress(entity, dir, gameState, coordinate, engine) {
        gameState.blockMap.delete(this.position.x, this.position.y, 2);
        gameState.blockMap.set(this.position.x, this.position.y, this, 1);
    }
}
