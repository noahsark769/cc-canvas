let { Tile } = require("./Tile");
let { Direction } = require("../core/2d/directions");
let { PlayerSlipType } = require("../entity/player");

export class Force extends Tile {
    constructor(...args) {
        super(...args);
        this.direction = null;
    }

    directionForEntityToSlip(entity, direction, gameState) {
        if (entity.name === "player" && gameState.boots.force) {
            return null;
        }
        return this.direction;
    }

    slipTypeForPlayer(entity, gameState) {
        return PlayerSlipType.force();
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
