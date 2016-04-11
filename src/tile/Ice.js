let { Tile } = require("./Tile");

export class Ice extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "ice";
    }

    entityWillPress(entity, direction, gameState, coordinate, engine) {
        if (entity.name === "player") {
            entity.slipDirection = direction;
        }
    }

    entityWillUnpress(entity, direction, gameState, coordinate, engine) {
        if (entity.name === "player") {
            entity.slipDirection = null;
        }
    }
}
