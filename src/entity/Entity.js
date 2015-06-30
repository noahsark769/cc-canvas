let {NORTH, SOUTH, EAST, WEST} = require("../core/2d/directions");

export class Entity {
    constructor(renderer, direction = SOUTH) {
        this.renderer = renderer;
        this.direction = direction;
        this.state = "normal";
    }
    render(canvas, coordinate) {
        this.renderer.renderEntity(canvas, this, coordinate);
    }
}
