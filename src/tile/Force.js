let { Tile } = require("./Tile");
let { Direction } = require("../core/2d/directions");
import { SlipType } from "../entity/SlipType";

export class Force extends Tile {
    constructor(...args) {
        super(...args);
        this.direction = null;
    }

    directionToPush() {
        return this.direction;
    }

    directionForEntityToSlip(entity, direction, gameState) {
        if (entity.name === "player" && gameState.boots.force) {
            return null;
        }
        return this.directionToPush();
    }

    slipTypeForPlayer(entity, gameState) {
        return SlipType.force();
    }
}

export class ForceLeft extends Force {
    constructor(...args) {
        super(...args);
        this.direction = Direction.west();
        this.name = "force_left";
    }
}

export class ForceRight extends Force {
    constructor(...args) {
        super(...args);
        this.direction = Direction.east();
        this.name = "force_right";
    }
}

export class ForceUp extends Force {
    constructor(...args) {
        super(...args);
        this.direction = Direction.north();
        this.name = "force_up";
    }
}

export class ForceDown extends Force {
    constructor(...args) {
        super(...args);
        this.direction = Direction.south();
        this.name = "force_down";
    }
}

export class ForceRandom extends Force {
    constructor(...args) {
        super(...args);
        this.name = "force_random";
    }

    directionToPush() {
        if (ForceRandom.overrideDirection) {
            return ForceRandom.overrideDirection;
        }
        return [Direction.north(), Direction.south(), Direction.east(), Direction.west()][
            Math.floor(Math.random() * 4)
        ];
    }
}
