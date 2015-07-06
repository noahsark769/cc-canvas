let { Tile } = require("./Tile");

export class Floor extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "floor";
    }
    shouldBlockPlayer(player) {
        return false;
    }
    shouldBlockEntity(entity) {
        return false;
    }
    playerShouldReplace() {
        return true;
    }
}
