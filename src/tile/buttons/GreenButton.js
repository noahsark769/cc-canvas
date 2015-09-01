let { Tile } = require("../Tile");

export class GreenButton extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "button_green";
    }
    shouldBlockEntity(entity, direction, gameState) {
        return false;
    }
    entityShouldReplace(entity) {
        return false;
    }
    entityWillPress(entity, direction, gameState) {
        gameState.requestWallToggle();
    }
}
