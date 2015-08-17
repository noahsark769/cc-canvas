import { Direction } from "../core/2d/directions";

let CURR_ID = 0;
// TODO: pretty sure we don't use the entity master map anymore
let ENTITY_MASTER_MAP = new Map();

export class Entity {
    constructor(direction, position) {
        this.direction = direction;
        this.position = position;
        this.state = "normal";
        this.id = CURR_ID;
        CURR_ID++;
        ENTITY_MASTER_MAP.set(this.id, this);
    }
    /**
     * Return a new copy of this entity. Note that this entity will have still
     * NOT have the same id of the original.
     */
    clone() {
        let entity = new Entity();
        entity.direction = this.direction;
        entity.state = this.state;
        return entity;
    }
    render(canvas, renderer, coordinate) {
        renderer.renderEntity(canvas, this, coordinate);
    }
    chooseMove(tileMap, entityMap, coordinate) {
        // do nothing by default
        return false;
    }
    // return whether the given entity should block the path of THIS entity.
    shouldBlockEntity(entity) {
        return true;
    }
    getTile() {
        let {TileManager} = require("../tile/TileManager");
        let tileClass = TileManager.getInstance().tileClassByName(this.name + "-" + this.direction.asStringDirection());
        return new tileClass();
    }
    toString() {
        return "<Entity (" + this.name + ") with " + this.direction + " at " + this.position.serialize();
    }

    performMove(newCoord, direction, gameState) {
        let newTile = gameState.tileMap.get(newCoord.x, newCoord.y, 1);
        if (!newTile || newTile.entityShouldReplace(this)) {
            if (newTile) { newTile.entityWillOccupy(this, direction, gameState, newCoord, gameState.engine); }
            gameState.tileMap.set(newCoord.x, newCoord.y, this.getTile(), 1);
        } else {
            newTile.entityWillPress(this, direction, gameState, newCoord, gameState.engine);
            gameState.tileMap.set(newCoord.x, newCoord.y, gameState.tileMap.get(newCoord.x, newCoord.y, 1), 2);
            gameState.tileMap.set(newCoord.x, newCoord.y, this.getTile(), 1);
        }

        let lastSecondLayer = gameState.tileMap.get(this.position.x, this.position.y, 2);
        if (!lastSecondLayer) {
            gameState.tileMap.setTileByName(this.position.x, this.position.y, "floor", 1);
        } else {
            lastSecondLayer.entityWillUnpress(this, direction, gameState, this.position, gameState.engine)
            gameState.tileMap.set(this.position.x, this.position.y, lastSecondLayer, 1)
        }
    }
}

Entity.getById = function(id) {
    return ENTITY_MASTER_MAP.get(id);
}
