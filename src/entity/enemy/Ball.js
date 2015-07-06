let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Ball extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "ball";
    }

    getDirectionsInOrder() {
        return [
            this.direction,
            this.direction.clockwise().clockwise()
        ];
    }
}

export class BallSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "ball-south";
    }
}

export class BallNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "ball-north";
    }
}

export class BallEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "ball-east";
    }
}

export class BallWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "ball-west";
    }
}
