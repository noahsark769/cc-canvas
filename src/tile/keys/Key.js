let { Tile } = require("../Tile");

export class Key extends Tile {
    constructor(...args) {
        super(...args);
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }

    entityShouldReplace(entity) {
        return entity.name === "player";
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
