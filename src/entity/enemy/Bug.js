let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Bug extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "bug";
    }

    chooseMove(gameState) {
        let tileMap = gameState.tileMap;
        let dirsToTry = [
            this.direction.counterclockwise(),
            this.direction,
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];

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

        if (newTile) {
            console.log("Bug will occupy " + newCoord + " where tile is " + newTile);
            newTile.entityWillOccupy(this, newDir, gameState);
        }
        this.direction = newDir;
        this.position = newCoord;
    }
}

export class BugSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-south";
    }
}

export class BugNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-north";
    }
}

export class BugEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-east";
    }
}

export class BugWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-west";
    }
}
