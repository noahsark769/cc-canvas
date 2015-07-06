let {Entity} = require("../Entity");
let {Tile} = require("../../tile/Tile");

export class Monster extends Entity {
    constructor(...args) {
        super(...args);
    }

    chooseMove(gameState) {
        let tileMap = gameState.tileMap;
        let dirsToTry = this.getDirectionsInOrder(gameState);

        let newCoord;
        for (let dir of dirsToTry) {
            newCoord = dir.coordinateFor(this.position, 1);
            if (
                (tileMap.has(newCoord.x, newCoord.y) && tileMap.get(newCoord.x, newCoord.y).shouldBlockEntity(this)) ||
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

    advance(newDir, newCoord, gameState) {
        let newTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        if (newTile && newTile.isLethalToEntity(this)) {
            gameState.monsterList.remove(this);
            // if there was a tile under us, move it up. otherwise, replace us with floor
            if (gameState.tileMap.has(this.position.x, this.position.y, 2)) {
                gameState.tileMap.set(this.position.x, this.position.y, gameState.tileMap.get(this.position.x, this.position.y, 2), 1);
            } else {
                gameState.tileMap.setTileByName(this.position.x, this.position.y, "floor", 1);
            }
            return;
        }

        this.direction = newDir;
        if (!newTile || newTile.entityShouldReplace()) {
            gameState.tileMap.set(newCoord.x, newCoord.y, this.getTile(), 1);
        } else {
            gameState.tileMap.set(newCoord.x, newCoord.y, gameState.tileMap.get(newCoord.x, newCoord.y, 1), 2);
            gameState.tileMap.set(newCoord.x, newCoord.y, this.getTile(), 1);
        }

        let lastSecondLayer = gameState.tileMap.get(this.position.x, this.position.y, 2);
        if (!lastSecondLayer) {
            gameState.tileMap.setTileByName(this.position.x, this.position.y, "floor", 1);
        } else {
            gameState.tileMap.set(this.position.x, this.position.y, lastSecondLayer, 1)
        }
        gameState.tileMap.get(this.position.x, this.position.y, 1).entityWillExit(this, newDir, gameState, this.position, gameState.engine);

        if (newTile) {
            newTile.entityWillOccupy(this, newDir, gameState);
        }
        this.position = newCoord;
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
    entityWillOccupy(entity, direction, gameState) {
        if (entity.name === "player") {
            gameState.isOver = true;
            gameState.isLoss = true;
        }
    }
    isTransparent() {
        return true;
    }
    shouldBlockEntity(entity) {
        return true;
    }
}
