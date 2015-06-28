const NORTH = "north";
const SOUTH = "south";
const EAST = "east";
const WEST = "west";

export class Entity {
    constructor(renderer, direction = SOUTH) {
        this.renderer = renderer;
        this.direction = direction;
    }
    render(canvas, coordinate) {
        this.renderer.renderEntity(canvas, this, coordinate);
    }
}
