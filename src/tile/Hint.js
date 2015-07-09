let { Tile } = require("./Tile");

export class Hint extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "hint";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    entityWillPress(entity, dir, gameState, coordinate, engine) {
        if (entity.name === "player") {
            engine.interface("showHint");
        }
    }
    entityWillUnpress(entity, dir, gameState, coordinate, engine) {
        if (entity.name === "player") {
            engine.interface("hideHint");
        }
    }
}
