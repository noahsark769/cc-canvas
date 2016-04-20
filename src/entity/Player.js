let {Entity} = require("./Entity");
let {Tile} = require("../tile/Tile");

export class PlayerTile extends Tile {
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name === "player";
    }
    entityShouldReplace() {
        return false;
    }
    isTransparent() {
        return true;
    }
    entityWillPress(entity, direction, gameState) {
        gameState.isOver = true;
        gameState.isLoss = true;
    }
}

export class PlayerDeadWater extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "player-dead-water";
    }
    shouldBlockEntity(entity) {
        return true;
    }
}

export class PlayerDeadFire extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "player-dead-fire";
    }
    shouldBlockEntity(entity) {
        return true;
    }
}

export class PlayerDeadCharred extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "player-dead-charred";
    }
    shouldBlockEntity(entity) {
        return true;
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

class PlayerSwimTile extends PlayerTile {
    isTransparent() {
        return false;
    }
}

export class PlayerSwimSouth extends PlayerSwimTile {
    constructor(...args) {
        super(...args);
        this.name = "player-south-swim";
    }
}

export class PlayerSwimNorth extends PlayerSwimTile {
    constructor(...args) {
        super(...args);
        this.name = "player-north-swim";
    }
}

export class PlayerSwimEast extends PlayerSwimTile {
    constructor(...args) {
        super(...args);
        this.name = "player-east-swim";
    }
}

export class PlayerSwimWest extends PlayerSwimTile {
    constructor(...args) {
        super(...args);
        this.name = "player-west-swim";
    }
}

/**
 * The main class which represents a player currently playing a level.
 *
 * A player is different from a monster in a few ways: it stores it's state, which might be "swim" or "dead"
 * etc, and it can render the correct tile based on state. Also, it manages slipping internally.
 *
 * Note on slipping: the player is never put on the sliplist. Instead, Player stores a property
 * called slipDirection, which may be any Direction. You can find out if a Player is slipping currently
 * (on force floors or on ice) using isSlipping(). You can find out whether a player can step away to stop
 * slipping (e.g. on force floors) with canCancelSlipWithStepInDirection(). You can cause a player to start
 * slipping with .startSlipping(direction, type)
 *
 * GameState has a method called tickPlayerSlip() which looks at the player, assumes it's slipping, and
 * moves it for one tick based on the slip direction.
 *
 * Note that monsters slip in an entirely different fashion, using the sliplist.
 */
export class Player extends Entity {
    constructor(state, ...args) {
        super(...args);
        this.state = state;
        this.name = "player";
        this.slipDirection = null;
        this.slipType = null;
    }

    chooseMove(direction, gameState) {
        let lowerLayerSourceTile = gameState.tileMap.get(this.position.x, this.position.y, 2);
        if (lowerLayerSourceTile && lowerLayerSourceTile.shouldBlockEntityExit(this, direction, gameState)) {
            return false;
        }
        let newCoord = direction.coordinateFor(this.position, 1);
        if (newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= gameState.level.width || newCoord.y >= gameState.level.height) {
            return false;
        }
        let upperLayerDestTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        let lowerLayerDestTile = gameState.tileMap.get(newCoord.x, newCoord.y, 2);
        // TODO: special case for clone machine
        if (upperLayerDestTile && upperLayerDestTile.shouldBlockEntity(this, direction, gameState, newCoord)) {
            return false;
        }
        if ((!upperLayerDestTile || upperLayerDestTile.isTransparent()) && lowerLayerDestTile && lowerLayerDestTile.shouldBlockEntity(this, direction, gameState, newCoord)) {
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
        this.performMove(newCoord, direction, gameState);
        this.position = newCoord;
    }

    /**
     * @return {Boolean} Whether the player is slipping or not.
     */
    isSlipping() {
        return this.slipDirection !== null;
    }

    /**
     * @param  {Direction} direction The direction to check
     * @return {Boolean} Whether this player can step off the slipping surface in the given direction.
     */
    canCancelSlipWithStepInDirection(direction) {
        // TODO(force floors): implement this.
        return false
    }

    /**
     * Cause the player to start slipping in the given direction annd type.
     */
    startSlipping(direction, type) {
        self.slipDirection = direction;
        selt.slipType = type;
    }

    /**
     * Return a Tile to display the Player entity as.
     */
    getTile() {
        let {TileManager} = require("../tile/TileManager");
        let tileClass;
        if (this.state === "dead-water" || this.state === "dead-fire" || this.state === "dead-charred") {
            tileClass = TileManager.getInstance().tileClassByName("player-" + this.state);
        } else {
            tileClass = TileManager.getInstance().tileClassByName("player-" + this.direction.asStringDirection() + "-" + this.state);
        }
        return new tileClass();
    }
};
