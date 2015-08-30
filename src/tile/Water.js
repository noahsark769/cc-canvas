let { Tile } = require("./Tile");

export class Water extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "water";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    // when blocks replace and then occupy water,
    entityShouldReplace(entity) {
        return false;
    }
    // kills every monster except for gliders
    // note that this method does not apply to player
    // Note also: this applies to block, but the process of moving a block tile
    // to a water tile is done in entity will occupy.
    isLethalToEntity(entity) {
        return entity.name !== "glider";
    }
    entityWillPress(entity, direction, gameState) {
        if (entity.name === "player") {
            gameState.isOver = true;
            gameState.isLoss = true;
            entity.state = "dead-water";
        }
    }
    // note: this assumes dirt will always appear on the first layer
    entityWillOccupy(entity, direction, gameState, coordinate, engine) {
        if (entity.name === "block") {
            gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "dirt", 1);
        }
    }
}
