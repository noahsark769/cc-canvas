let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Paramecium extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "paramecium";
    }

    getDirectionsInOrder() {
        return [
            this.direction.clockwise(),
            this.direction,
            this.direction.counterclockwise(),
            this.direction.clockwise().clockwise()
        ];
    }
}

export class ParameciumSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "paramecium-south";
    }
}

export class ParameciumNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "paramecium-north";
    }
}

export class ParameciumEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "paramecium-east";
    }
}

export class ParameciumWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "paramecium-west";
    }
}
