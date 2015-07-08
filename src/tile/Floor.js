let { Tile } = require("./Tile");

export class Floor extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "floor";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
}
