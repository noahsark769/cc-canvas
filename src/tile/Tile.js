export class Tile {
    constructor() {}

    render(canvas, renderer, coordinate) {
        renderer.renderTile(canvas, this, coordinate);
    }

    shouldBlockPlayer(player) {
        return false;
    }

    shouldBlockEntity(entity) {
        return false;
    }

    /**
     * Will be called when the entity moves into this tile.
     */
    entityWillOccupy(entity, dir, gameState, coordinate, engine) {}
    playerWillOccupy(player, dir, gameState) {}
    entityWillExit(entity, dir, gameState, coordinate, engine) {}
    isTransparent() {
        return false;
    }
    playerShouldReplace() {
        return false;
    }
    entityShouldReplace(entity) {
        return false;
    }
}
