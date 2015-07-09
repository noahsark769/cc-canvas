let { Tile } = require("./Tile");

export class Escape extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "escape";
    }
    shouldBlockEntity(entity) {
        return entity.name !== "player";
    }
    entityWillPress(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            gameState.isWin = true;
            gameState.isOver = true;
        }
    }
}
