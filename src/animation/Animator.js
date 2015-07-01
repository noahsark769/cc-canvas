let {Coordinate} = require("../core/2d/Coordinate");
/**
 * The Animator class is responsible for drawing tiles, entities, level, etc to
 * the canvas and updating the display as the GameState changes. Usually, the
 * Animator will not draw things directly, but instead delegate drawing to an
 * ImageRenderer (or maybe in the future, another type of renderer).
 *
 * The ImageRenderers, however, should not need to know about the actual canvas:
 * instead, they should be passed the canvas context from the Animator. The
 * Animator will keep track of the actual canvas instance to draw.
 */
export class Animator {
    /**
     * Construct an Animator by passing it the canvas to draw on.
     * @param {Element} the actual canvas. Can be accessed through DocumentInterface
     */
    constructor(canvas, renderer) {
        this.canvas = canvas;
        this.renderer = renderer;
    }

    clear() {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderEntityForTile() {

    }

    // right now, just render in the top right corner. eventually we will need to
    // impelement Viewport, etc.
    renderTile(tile, coordinate) {
        tile.render(this.canvas, this.renderer, coordinate);
    }

    renderEntity(entity, coordinate) {
        entity.render(this.canvas, this.renderer, coordinate)
    }

    renderViewport(viewport, gameState) {
        for (let coordinate of viewport.coordinatesInBounds()) {
            if (gameState.hasTileAt(coordinate.x, coordinate.y)) {
                let tile = gameState.getTileAt(coordinate.x, coordinate.y);
                this.renderTile(tile, new Coordinate(coordinate.x - viewport.getMinX(), coordinate.y - viewport.getMinY()));
            }
            // right now, entities will entirely superseed tiles
            if (gameState.hasEntityAt(coordinate.x, coordinate.y)) {
                let entity = gameState.getEntityAt(coordinate.x, coordinate.y);
                this.renderEntity(entity, new Coordinate(coordinate.x - viewport.getMinX(), coordinate.y - viewport.getMinY()));
            }
        }
    }
}
