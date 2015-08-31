let { Tile } = require("./Tile");

export class Gravel extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "gravel";
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player" || entity.name === "block") {
            return false;
        }
        return true;
    }
}
