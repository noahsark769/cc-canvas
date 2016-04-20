let { Tile } = require("./Tile");

/**
 * A tile that blocks monsters and blocks, but becomes floor once a player steps on it.
 */
export class Dirt extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "dirt";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name !== "player";
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
}
