import { Entity } from "./Entity";
import { Tile } from "../tile/Tile";

export class Block extends Entity {
    canMove(direction, gameState) {
        // block's direction is null unless sliding
        // this method determines whether the block can be pushed in the given direction
        let target = direction.coordinateFor(this.position, 1);
        let targetTileUpper = gameState.tileMap.get(target.x, target.y, 1);
        let targetTileLower = gameState.tileMap.get(target.x, target.y, 2);
        let thisTileLower = gameState.tileMap.get(this.position.x, this.position.y, 2);
        if (
            (targetTileUpper && targetTileUpper.shouldBlockEntity(this)) ||
            ((!targetTileUpper || targetTileUpper.isTransparent()) && targetTileLower && targetTileLower.shouldBlockEntity(this)) ||
            (thisTileLower && thisTileLower.shouldBlockEntityExit(this, direction, gameState))
        ) {
            return false;
        }
        return true;
    }
    move(direction, gameState) {
        let target = direction.coordinateFor(this.position, 1);
        this.performMove(target, gameState);
    }
    getTile() {
        return new BlockTile(this);
    }
}

export class BlockTile extends Tile {
    constructor(...args) {
        super(...args);
    }
    getEntity(gameState) {
        return gameState.blockMap.get(...this.position.asArray(), 1);
    }
    shouldBlockEntity(entity, direction, gameState) {
        // if (entity.name === "player") {
        //     return !this.entity.canMove(direction, gameState);
        // }
        // return true;
        return true;
    }
}
