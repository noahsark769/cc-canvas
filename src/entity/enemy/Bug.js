let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

export class Bug extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "bug";
    }

    getDirectionsInOrder() {
        return [
            this.direction.counterclockwise(),
            this.direction,
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];
    }
}

export class BugSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-south";
    }
}

export class BugNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-north";
    }
}

export class BugEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-east";
    }
}

export class BugWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "bug-west";
    }
}
