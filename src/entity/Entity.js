let {NORTH, SOUTH, EAST, WEST, Direction} = require("../core/2d/directions");

let CURR_ID = 0;
let ENTITY_MASTER_MAP = new Map();

export class Entity {
    constructor(direction, position) {
        this.direction = new Direction(direction);
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
}

Entity.getById = function(id) {
    return ENTITY_MASTER_MAP.get(id);
}
