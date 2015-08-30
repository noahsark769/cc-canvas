let { Tile } = require("./Tile");

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
