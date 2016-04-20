let { Tile } = require("./Tile");

/**
 * A blue wall that blocks movement of everything but becomes floor when touched by a player.
 */
export class BlueWallFake extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "block_mystery_fake";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return entity.name !== "player";
    }
    entityShouldReplace(entity) {
        return entity.name === "player";
    }
}

/**
 * A wall that looks and behaes like a fake blue wall, but becomes real when touched by a player.
 */
export class BlueWallReal extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "block_mystery_real";
    }
    shouldBlockEntity(entity, direction, gameState) {
        if (entity.name === "player") {
            let target = direction.coordinateFor(entity.position, 1);
            // NOTE: here we assume blue walls cannot block from the bottom layer
            gameState.tileMap.setTileByName(target.x, target.y, "wall", 1);
        }
        return true;
    }
}
