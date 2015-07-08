let { Tile } = require("./Tile");

export class Socket extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "socket";
    }

    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player") {
            if (gameState.DEBUG) { return false; }
            return gameState.chipsLeft > 0;
        }
        return true;
    }

    entityShouldReplace(entity) {
        return entity.name === "player";
    }
}
