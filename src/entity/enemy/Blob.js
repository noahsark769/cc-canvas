let {Direction} = require("../../core/2d/directions");
let {SlowMonster, MonsterStateTile} = require("./Monster");
let {shuffle} = require("../../util/random");

export class Blob extends SlowMonster {
    constructor(...args) {
        super(...args);
        this.name = "blob";
    }

    getDirectionsInOrder() {
        let dirs = [
            this.direction.counterclockwise(),
            this.direction,
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];
        return shuffle(dirs);
    }
}

export class BlobSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "blob-south";
    }
}

export class BlobNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "blob-north";
    }
}

export class BlobEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "blob-east";
    }
}

export class BlobWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "blob-west";
    }
}
