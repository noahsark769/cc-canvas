let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");
let {shuffle} = require("../../util/random");

export class Walker extends Monster {
    constructor(...args) {
        super(...args);
        this.name = "walker";
    }

    getDirectionsInOrder() {
        let dirs = [
            this.direction.counterclockwise(),
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];
        dirs = shuffle(dirs);
        dirs.unshift(this.direction);
        return dirs;
    }
}

export class WalkerSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "walker-south";
    }
}

export class WalkerNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "walker-north";
    }
}

export class WalkerEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "walker-east";
    }
}

export class WalkerWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "walker-west";
    }
}
