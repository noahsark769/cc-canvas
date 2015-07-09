let { Tile } = require("./Tile");

export class Water extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "water";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    // nothing happens on entity occupy, because it never happens, because water is never replaced
    entityShouldReplace(entity) {
        return false
    }
    // kills every monster except for gliders
    // note that this method does not apply to player or block
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
}
