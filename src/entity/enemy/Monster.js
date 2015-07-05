let {Entity} = require("../Entity");
let {Tile} = require("../../tile/Tile");

export class Monster extends Entity {
    constructor(...args) {
        super(...args);
    }
}

export class MonsterStateTile extends Tile {
    entityWillOccupy(entity, direction, gameState) {
        if (entity.name === "player") {
            gameState.isOver = true;
            gameState.isLoss = true;
        }
    }
    shouldBlockEntity(entity) {
        return true;
    }
}
