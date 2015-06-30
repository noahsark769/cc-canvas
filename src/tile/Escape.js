let { Tile } = require("./Tile");

export class Escape extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "escape";
    }
    shouldBlockPlayer(player) {
        return false;
    }
    shouldBlockEntity(entity) {
        return true;
    }
    entityWillOccupy(entityName, dir, gameState, coordinate) {
        if (entityName === "player") {
            gameState.isWin = true;
            gameState.isOver = true;
        }
    }
}
