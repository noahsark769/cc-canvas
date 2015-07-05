let {Coordinate} = require("../core/2d/Coordinate");
let {Floor} = require("../tile/Floor");
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

    shouldRenderFloor(gameState, coordinate) {
        let upper = gameState.tileMap.get(coordinate.x, coordinate.y, 1);
        let lower = gameState.tileMap.get(coordinate.x, coordinate.y, 2);
        if (!upper && !lower) {
            return true;
        }
        if (upper && !upper.isTransparent()) {
            return false;
        }
        if (lower && !lower.isTransparent()) {
            return false;
        }
        return true;
    }

    // TODO: transparent tiles
    renderViewport(viewport, gameState) {
        for (let coordinate of viewport.coordinatesInBounds()) {
            if (this.shouldRenderFloor(gameState, coordinate)) {
                this.renderTile(new Floor(), new Coordinate(coordinate.x - viewport.getMinX(), coordinate.y - viewport.getMinY()));
            }
            if (
                (
                    !gameState.tileMap.has(coordinate.x, coordinate.y, 1) ||
                    (
                        gameState.tileMap.has(coordinate.x, coordinate.y, 1) &&
                        gameState.tileMap.get(coordinate.x, coordinate.y, 1).isTransparent()
                    )
                ) &&
                gameState.tileMap.has(coordinate.x, coordinate.y, 2)
            ) {
                let tile = gameState.tileMap.get(coordinate.x, coordinate.y, 2);
                this.renderTile(tile, new Coordinate(coordinate.x - viewport.getMinX(), coordinate.y - viewport.getMinY()));
            }
            if (gameState.tileMap.has(coordinate.x, coordinate.y, 1)) {
                let tile = gameState.tileMap.get(coordinate.x, coordinate.y, 1);
                this.renderTile(tile, new Coordinate(coordinate.x - viewport.getMinX(), coordinate.y - viewport.getMinY()));
            }
        }
    }
}
