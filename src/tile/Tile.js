export class Tile {
    constructor() {}

    render(canvas, renderer, coordinate) {
        renderer.renderTile(canvas, this, coordinate);
    }

    shouldBlockEntity(entity, direction, gameState, coordinate) {
        return false;
    }

    shouldBlockEntityExit(entity, direction, gameState) {
        return false;
    }

    /**
     * Will be called when the entity moves into this tile.
     */
    entityWillOccupy(entity, dir, gameState, coordinate, engine) {}
    entityWillPress(entity, dir, gameState, coordinate, engine) {}
    entityDidPress(entity, dir, gameState, coordinate, engine) {}
    entityWillUnpress(entity, dir, gameState, coordinate, engine) {}
    isTransparent() {
        return false;
    }
    entityShouldReplace(entity) {
        return false;
    }
    isLethalToEntity(entity) {
        return false;
    }

    toString() {
        return "<Tile: " + this.name + ">";
    }
}
