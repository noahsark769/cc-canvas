let { Tile } = require("./Tile");

/**
 * A tile that becomes a wall once a player has stepped on it. Cement blocks all monsters and blocks.
 */
export class Cement extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "cement";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name !== "player";
    }
    entityShouldReplace(entity) {
        return false;
    }
    entityDidPress(entity, direction, gameState, coordinate) {
        gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "wall", 2);
    }
}
