let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Fireball extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "fireball";
    }

    getDirectionsInOrder() {
        return [
            this.direction,
            this.direction.clockwise(),
            this.direction.counterclockwise(),
            this.direction.clockwise().clockwise()
        ];
    }
}

export class FireballSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "fireball-south";
    }
}

export class FireballNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "fireball-north";
    }
}

export class FireballEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "fireball-east";
    }
}

export class FireballWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "fireball-west";
    }
}
