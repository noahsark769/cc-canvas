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
    entityWillOccupy(entityName, dir, gameState, coordinate, engine) {
        if (entityName === "player") {
            engine.interface("showHint");
        }
    }
    entityWillExit(entityName, dir, gameState, coordinate, engine) {
        if (entityName === "player") {
            engine.interface("hideHint");
        }
    }
}
