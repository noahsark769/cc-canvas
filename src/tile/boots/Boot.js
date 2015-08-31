let { Tile } = require("../Tile");

export class Boot extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
    isTransparent() {
        return true;
    }
    entityWillOccupy(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            gameState.boots[this.bootName] = true;
        }
    }
}
