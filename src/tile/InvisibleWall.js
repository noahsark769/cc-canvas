let { Tile } = require("./Tile");

export class InvisibleWall extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "wall_invisible";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return true;
    }
}

export class InvisibleWallAppearing extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "wall_invisible_appearing";
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player") {
            let target = direction.coordinateFor(entity.position, 1);
            // NOTE: here we assume invisible walls cannot block from the bottom layer
            gameState.tileMap.setTileByName(target.x, target.y, "wall", 1);
        }
        return true;
    }
}
