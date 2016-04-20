let { Tile } = require("./Tile");

/**
 * A chip (for collecting by the player). The point of the game is to get to the escape square,
 * which is usually guarded by a Socket, which can only be removed if the required amount of chips
 * in the level have been collected.
 */
export class Chip extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "chip";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name !== "player";
    }
    /**
     * When the player occupies a chip at a certain coordinate, decrease the
     * chips needed and replace the tile with floor.
     * TODO: when implementing two levels, may need to change this.
     */
    entityWillOccupy(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            gameState.chipsLeft--;
        }
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
}
