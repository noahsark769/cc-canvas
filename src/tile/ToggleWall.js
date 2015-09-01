let { Tile } = require("./Tile");

class BaseToggleWall extends Tile {
    entityWillPress(entity, direction, gameState, coordinate, engine) {
        gameState.toggleWallMap.set(coordinate.x, coordinate.y, 2);
    }
    entityWillUnpress(entity, direction, gameState, coordinate, engine) {
        gameState.toggleWallMap.set(coordinate.x, coordinate.y, 1);
    }
    entityWillRemoveFromMap(entity, direction, gameState, newCoord, engine) {
        gameState.toggleWallMap.delete(newCoord.x, newCoord.y);
    }
}

export class ToggleWallOpen extends BaseToggleWall {
    constructor(...args) {
        super(...args);
        this.name = "toggle_open";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    getToggledTile() {
        return new ToggleWallClosed();
    }
}

export class ToggleWallClosed extends BaseToggleWall {
    constructor(...args) {
        super(...args);
        this.name = "toggle_closed";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return true;
    }
    getToggledTile() {
        return new ToggleWallOpen();
    }
}
