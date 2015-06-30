export class Tile {
    constructor(renderer) {
        this.renderer = renderer;
    }

    render(canvas, coordinate) {
        this.renderer.renderTile(canvas, this, coordinate);
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
    entityWillOccupy(entity, dir, gameState, coordinate) {

    }
}
