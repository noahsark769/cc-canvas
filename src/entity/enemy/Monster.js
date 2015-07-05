let {Entity} = require("../Entity");
let {Tile} = require("../../tile/Tile");

export class Monster extends Entity {
    constructor(...args) {
        super(...args);
    }
}

export class MonsterStateTile extends Tile {
    playerWillOccupy(player, direction, gameState) {
        gameState.isOver = true;
        gameState.isLoss = true;
    }
}
