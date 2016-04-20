let { Tile } = require("./Tile");

/**
 * A bomb. Destroys anything that touches it.
 */
export class Bomb extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "bomb";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    entityShouldReplace(entity) {
        return false;
    }
    isLethalToEntity(entity) {
        return true;
    }
    entityWillOccupy(entity, direction, gameState, coordinate, engine) {
        gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "floor", 1);
    }
    entityWillPress(entity, direction, gameState) {
        if (entity.name === "player") {
            gameState.isOver = true;
            gameState.isLoss = true;
            entity.state = "dead-charred";
        }
    }
}
