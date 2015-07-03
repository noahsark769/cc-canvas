let { Tile } = require("./Tile");

export class Wall extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "wall";
    }
    shouldBlockPlayer(player, gameState) {
        if (gameState.DEBUG) { return false; }
        return true;
    }
    shouldBlockEntity(entity) {
        return true;
    }
}
