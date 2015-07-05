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
    entityWillOccupy(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            gameState.isWin = true;
            gameState.isOver = true;
        }
    }
}
