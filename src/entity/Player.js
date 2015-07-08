let {Entity} = require("./Entity");
let {Tile} = require("../tile/Tile");

export class PlayerTile extends Tile {
    shouldBlockPlayer() {
        console.log("WOAH blocked by self!!!");
        return true;
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name === "player" || entity.name === "block";
    }
    entityShouldReplace() {
        return false;
    }
    isTransparent() {
        return true;
    }
    entityWillOccupy(entity, direction, gameState) {
        gameState.isOver = true;
        gameState.isLoss = true;
    }
}

export class PlayerSouth extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-south-normal";
    }
}

export class PlayerNorth extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-north-normal";
    }
}

export class PlayerEast extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-east-normal";
    }
}

export class PlayerWest extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-west-normal";
    }
}

export class PlayerSwimSouth extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-south-swim";
    }
}

export class PlayerSwimNorth extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-north-swim";
    }
}

export class PlayerSwimEast extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-east-swim";
    }
}

export class PlayerSwimWest extends PlayerTile {
    constructor(...args) {
        super(...args);
        this.name = "player-west-swim";
    }
}

export class Player extends Entity {
    constructor(state, ...args) {
        super(...args);
        this.state = state;
        this.name = "player";
    }

    chooseMove(direction, gameState) {
        let lowerLayerSourceTile = gameState.tileMap.get(this.position.x, this.position.y, 2);
        console.log(this + " encountered " + lowerLayerSourceTile + " when trying to decide whether to go " + direction);
        if (lowerLayerSourceTile && lowerLayerSourceTile.shouldBlockEntityExit(this, direction, gameState)) {
            console.log(this + " decided based on the lower layer source tile to NOT go " + direction);
            return false;
        }
        let newCoord = direction.coordinateFor(this.position, 1);
        if (newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= gameState.level.width || newCoord.y >= gameState.level.height) {
            return false;
        }
        let upperLayerDestTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        let lowerLayerDestTile = gameState.tileMap.get(newCoord.x, newCoord.y, 2);
        // TODO: special case for clone machine
        if (upperLayerDestTile && upperLayerDestTile.shouldBlockEntity(this, direction, gameState)) {
            return false;
        }
        if ((!upperLayerDestTile || upperLayerDestTile.isTransparent()) && lowerLayerDestTile && lowerLayerDestTile.shouldBlockEntity(this, direction, gameState)) {
            return false;
        }
        return newCoord;
    }

    move(direction, newCoord, gameState) {
        // if the space we move onto has a tile in the upper layer and we're supposed to
        // replace it (instead of pushing it down), then we simply replace it. we also do this
        // if there's no upper layer.
        //
        // if we're supposed to push it down, we move the top layer tile to the bottom layer
        // and make ourselves the new top layer.
        //
        // the tile we exit will have the second layer pushed up into the first layer, or have
        // the first layer replaced with floor if no second layer tile exists.
        this.direction = direction;
        let newTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        if (!newTile || newTile.entityShouldReplace(this)) {
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

        gameState.tileMap.get(this.position.x, this.position.y, 1).entityWillExit(this, direction, gameState, this.position, gameState.engine);
        if (newTile) {
            newTile.entityWillOccupy(this, direction, gameState, newCoord, gameState.engine);
        }
        this.position = newCoord;
    }

    getTile() {
        let {TileManager} = require("../tile/TileManager");
        let tileClass = TileManager.getInstance().tileClassByName("player-" + this.direction.asStringDirection() + "-" + this.state);
        return new tileClass();
    }
};
