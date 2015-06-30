let { Tile } = require("./Tile");

export class Chip extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "chip";
    }
    shouldBlockPlayer(player) {
        return false;
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
            gameState.chipsLeft--;
        }
        gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "floor", this.renderer);
    }
}
