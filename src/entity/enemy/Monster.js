let {Entity} = require("../Entity");
let {Tile} = require("../../tile/Tile");

export class Monster extends Entity {
    constructor(...args) {
        super(...args);
    }

    _chooseMoveFromPossibleTargetPositions(gameState, currentPosition, positionsAndDirections) {
        let tileMap = gameState.tileMap;

        let newCoord, newTileFirstLayer, newTileSecondLayer, oldTileSecondLayer, dir;
        for (let target of positionsAndDirections) {
            [newCoord, dir] = target;
            newTileFirstLayer = tileMap.get(newCoord.x, newCoord.y, 1);
            newTileSecondLayer = tileMap.get(newCoord.x, newCoord.y, 2);
            oldTileSecondLayer = tileMap.get(currentPosition.x, currentPosition.y, 2);
            if (
                (oldTileSecondLayer && oldTileSecondLayer.shouldBlockEntityExit(this, dir, gameState)) ||
                (newTileFirstLayer && newTileFirstLayer.shouldBlockEntity(this, dir, gameState, newCoord)) ||
                (
                    newTileFirstLayer &&
                    newTileFirstLayer.name.indexOf("player") !== -1 &&
                    newTileSecondLayer &&
                    newTileSecondLayer.shouldBlockEntity(this, dir, gameState, newCoord)
                ) ||
                newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= gameState.level.width || newCoord.y >= gameState.level.height
            ) {
                continue;
            } else {
                // now we're gunna occupy the actual coordinate
                return [newCoord, dir];
            }
        }
        return [false, false];
    }

    _chooseMove(gameState, currentPosition, directions) {
        let targets = directions.map((direction) => {
            return [direction.coordinateFor(currentPosition, 1), direction]
        });
        return this._chooseMoveFromPossibleTargetPositions(gameState, currentPosition, targets);
    }

    chooseMove(gameState) {
        return this._chooseMove(gameState, this.position, this.getDirectionsInOrder(gameState));
    }

    chooseMoveSlippingInDirection(dir, gameState) {
        return this.chooseMoveSlippingFromPosition(this.position, dir, gameState);
    }

    chooseMoveSlippingFromPosition(fromPosition, direction, gameState) {
        let directions = [direction, direction.opposite()];
        return this._chooseMove(gameState, fromPosition, directions);
    }

    advanceFromPosition(currentPosition, newDir, newCoord, gameState) {
        let newTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        let newTileSecondLayer = gameState.tileMap.get(newCoord.x, newCoord.y, 2);
        let oldTileSecondLayer = gameState.tileMap.get(currentPosition.x, currentPosition.y, 2);
        if (
            (newTile && newTile.isLethalToEntity(this)) ||
            (newTile && newTile.name.indexOf("player") !== -1 && newTileSecondLayer && newTileSecondLayer.isLethalToEntity(this))
        ) {
            newTile.entityWillOccupy(this, newDir, gameState, newCoord, gameState.engine);
            gameState.monsterList.remove(this);
            // if there was a tile under us, move it up. otherwise, replace us with floor
            if (oldTileSecondLayer) {
                gameState.tileMap.set(currentPosition.x, currentPosition.y, oldTileSecondLayer, 1);
                oldTileSecondLayer.entityWillUnpress(this, newDir, gameState, newCoord, gameState.engine);
            } else {
                gameState.tileMap.setTileByName(currentPosition.x, currentPosition.y, "floor", 1);
            }
            return;
        }

        this.direction = newDir;
        this.performMove(newCoord, this.direction, gameState);
        this.position = newCoord;
    }

    advance(newDir, newCoord, gameState) {
        return this.advanceFromPosition(this.position, newDir, newCoord, gameState);
    }
}

export class SlowMonster extends Monster {
    chooseMove(gameState) {
        if (gameState.currentTicks % 4 !== 0) {
            return [false, false];
        }
        return super.chooseMove(gameState);
    }
}

export class MonsterStateTile extends Tile {
    entityWillPress(entity, direction, gameState) {
        if (entity.name === "player") {
            gameState.isOver = true;
            gameState.isLoss = true;
        }
    }
    isTransparent() {
        return true;
    }
    shouldBlockEntity(entity) {
        return entity.name !== "player";
    }
}
