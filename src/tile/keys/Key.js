let { Tile } = require("../Tile");

export class Key extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockPlayer(player, gameState) {
        return false;
    }
    shouldBlockEntity(entity) {
        return true;
    }

    entityWillOccupy(entityName, dir, gameState, coordinate) {
        if (entityName === "player") {
            if (this.color === "green") {
                gameState.greenKeys = 1;
            } else {
                gameState[this.color + "Keys"]++;
            }
            gameState.tileMap.setTileByName(coordinate.x, coordinate.y, "floor", this.renderer);
        }
    }
}
