let { Tile } = require("./Tile");

export class Fire extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "fire";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name === "bug" || entity.name === "walker";
    }
    // nothing happens on entity occupy, because it never happens, because fire is never replaced
    entityShouldReplace(entity) {
        return false;
    }
    // kills every monster except for gliders
    // note that this method does not apply to player or block
    isLethalToEntity(entity) {
        return ["fireball", "walker", "bug", "block"].indexOf(entity.name) === -1;
    }
    entityWillPress(entity, direction, gameState) {
        if (entity.name === "player" && !gameState.boots.fire) {
            gameState.isOver = true;
            gameState.isLoss = true;
            entity.state = "dead-fire";
        }
    }
}
