let { Tile } = require("../Tile");

export class Door extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player") {
            return gameState[this.color + "Keys"] === 0;
        }
        return true;
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
    /**
     * When the player occupies a chip at a certain coordinate, decrease the
     * chips needed and replace the tile with floor.
     * TODO: when implementing two levels, may need to change this.
     */
    entityWillOccupy(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            if (this.color === "green") return;
            gameState[this.color + "Keys"]--;
        }
    }
}
