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
    entityWillOccupy(entityName, dir, gameState, coordinate) {
        if (entityName === "player") {
            gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "floor", this.renderer);
        }
    }
}
