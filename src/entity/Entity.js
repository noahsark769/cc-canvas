let {NORTH, SOUTH, EAST, WEST} = require("../core/2d/directions");

export class Entity {
    constructor(direction = SOUTH) {
        this.direction = direction;
        this.state = "normal";
    }
    render(canvas, renderer, coordinate) {
        renderer.renderEntity(canvas, this, coordinate);
    }
}
