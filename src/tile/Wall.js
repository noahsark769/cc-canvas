let { Tile } = require("./Tile");

export class Wall extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "wall";
    }
    shouldBlockPlayer(player) {
        return true;
    }
    shouldBlockEntity(entity) {
        return true;
    }
}
