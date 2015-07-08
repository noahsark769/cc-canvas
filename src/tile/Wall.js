let { Tile } = require("./Tile");

export class Wall extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "wall";
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (gameState.DEBUG && entity.name === "player") { return false; }
        return true;
    }
}
