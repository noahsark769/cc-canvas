let { Tile } = require("./Tile");

export class Hint extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "hint";
    }
    shouldBlockPlayer(player) {
        return false;
    }
    shouldBlockEntity(entity) {
        return false;
    }
    entityWillOccupy(entity, dir, gameState, coordinate, engine) {
        if (entity.name === "player") {
            engine.interface("showHint");
        }
    }
    entityWillExit(entity, dir, gameState, coordinate, engine) {
        if (entity.name === "player") {
            engine.interface("hideHint");
        }
    }
}
