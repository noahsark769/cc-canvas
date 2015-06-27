export class Tile {
    constructor(renderer) {
        this.renderer = renderer;
    }

    render(canvas) {
        this.renderer.renderTile(canvas, this);
    }

    shouldBlockPlayer(player) {
        return false;
    }

    shouldBlockEntity(entity) {
        return false;
    }
}
