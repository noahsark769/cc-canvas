let { Tile } = require("./Tile");

export class Socket extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "socket";
    }

    shouldBlockPlayer(player, gameState) {
        if (gameState.DEBUG) { return false; }
        return gameState.chipsLeft !== 0;
    }

    shouldBlockEntity(entity, gameState) {
        return true;
    }

    playerShouldReplace() {
        return true;
    }
}
