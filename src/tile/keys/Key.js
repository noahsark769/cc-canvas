let { Tile } = require("../Tile");

export class Key extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockPlayer(player, gameState) {
        return false;
    }
    shouldBlockEntity(entity) {
        return false;
    }

    playerShouldReplace() {
        return true;
    }

    isTransparent() {
        return true;
    }

    entityWillOccupy(entity, dir, gameState, coordinate) {
        if (entity.name === "player") {
            if (this.color === "green") {
                gameState.greenKeys = 1;
            } else {
                gameState[this.color + "Keys"]++;
            }
        }
    }
}
