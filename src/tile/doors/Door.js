let { Tile } = require("../Tile");

export class Door extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockPlayer(player, gameState) {
        return gameState[this.color + "Keys"] == 0;
    }
    shouldBlockEntity(entity) {
        return true;
    }
    /**
     * When the player occupies a chip at a certain coordinate, decrease the
     * chips needed and replace the tile with floor.
     * TODO: when implementing two levels, may need to change this.
     */
    entityWillOccupy(entityName, dir, gameState, coordinate) {
        if (entityName === "player") {
            gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "floor", this.renderer);
            if (this.color === "green") return;
            gameState[this.color + "Keys"]--;
        }
    }
}
