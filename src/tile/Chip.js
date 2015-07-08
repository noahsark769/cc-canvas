let { Tile } = require("./Tile");

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
