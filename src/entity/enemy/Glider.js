let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Glider extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "glider";
    }

    getDirectionsInOrder() {
        return [
            this.direction,
            this.direction.counterclockwise(),
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];
    }
}

export class GliderSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "glider-south";
    }
}

export class GliderNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "glider-north";
    }
}

export class GliderEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "glider-east";
    }
}

export class GliderWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "glider-west";
    }
}
