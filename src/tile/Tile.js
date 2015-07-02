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
    entityWillOccupy(entity, dir, gameState, coordinate, engine) {

    }
    entityWillExit(entity, dir, gameState, coordinate, engine) {}
}
