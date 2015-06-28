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
    constructor(canvas) {
        this.canvas = canvas;
    }

    renderEntityForTile() {

    }

    // right now, just render in the top right corner. eventually we will need to
    // impelement Viewport, etc.
    renderTile(tile, coordinate) {
        tile.render(this.canvas, coordinate);
    }

    renderEntity(entity) {

    }

    renderViewport(viewport, gameState) {
        for (let coordinate of viewport.coordinatesInBounds()) {
            if (gameState.tileMap.has(coordinate.x, coordinate.y)) {
                let tile = gameState.tileMap.get(coordinate.x, coordinate.y);
                this.renderTile(tile, coordinate);
            }
        }
        // for every coordinate in the viewport:
        // .... if gameState.hasEntityAt(coordinate): gameState.getEntityAt(coordinate).render(canvas)
        // .... else: gameState.tileAt(coordinate).render(this.canvas)
    }
}
