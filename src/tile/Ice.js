let { Tile } = require("./Tile");
let {Direction} = require("../core/2d/directions");

export class Ice extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "ice";
        this.blockingDirections = [];
        this.propels = false;
        this.verticalClockwise = false;
    }

    propellingDirectionFromMovementDirection(direction) {
        if (!this.propels) {
            return direction;
        }
        if (direction.isVertical()) {
            if (this.verticalClockwise) {
                return direction.clockwise();
            }
            return direction.counterclockwise();
        }
        if (direction.isHorizontal()) {
            if (this.verticalClockwise) {
                return direction.counterclockwise();
            }
            return direction.clockwise();
        }
    }

    directionForEntityToSlip(entity, direction, gameState) {
        if (entity.name === "player" && gameState.boots.ice) {
            return null;
        }
        return this.propellingDirectionFromMovementDirection(direction);
    }

    shouldBlockEntity(entity, direction, gameState, coordinate) {
        for (let blockingDir of this.blockingDirections) {
            if (direction.equals(blockingDir)) {
                return true;
            }
        }
        return false;
    }
}

class IceCorner extends Ice {
    constructor(...args) {
        super(...args);
        this.propels = true;
    }
}

export class IceUpperLeft extends IceCorner {
    constructor(...args) {
        super(...args);
        this.blockingDirections = [Direction.south(), Direction.east()];
        this.verticalClockwise = true;
        this.name = "ice_ul";
    }
}

export class IceLowerLeft extends IceCorner {
    constructor(...args) {
        super(...args);
        this.blockingDirections = [Direction.north(), Direction.east()];
        this.verticalClockwise = false;
        this.name = "ice_ll";
    }
}

export class IceUpperRight extends IceCorner {
    constructor(...args) {
        super(...args);
        this.blockingDirections = [Direction.south(), Direction.west()];
        this.verticalClockwise = false;
        this.name = "ice_ur";
    }
}

export class IceLowerRight extends IceCorner {
    constructor(...args) {
        super(...args);
        this.blockingDirections = [Direction.north(), Direction.west()];
        this.verticalClockwise = true;
        this.name = "ice_lr";
    }
}
