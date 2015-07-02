let {NORTH, SOUTH, EAST, WEST, Direction} = require("../core/2d/directions");

let CURR_ID = 0;
let ENTITY_MASTER_MAP = new Map();

export class Entity {
    constructor(direction = SOUTH) {
        this.direction = new Direction(direction);
        this.state = "normal";
        this.id = CURR_ID;
        CURR_ID++;
        ENTITY_MASTER_MAP.set(this.id, this);
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
