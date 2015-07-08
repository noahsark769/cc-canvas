import { Tile } from "./Tile";

export class ThinWall extends Tile {
    constructor(...args) {
        super(...args);
    }
}

export class ThinWallBottom extends ThinWall {
    constructor(...args) {
        super(...args);
        this.name = "thin_bottom";
    }
    shouldBlockEntity(entity, direction, gameState) { return direction.isNorth(); }
    shouldBlockEntityExit(entity, direction, gameState) { return direction.isSouth(); }
}

export class ThinWallTop extends ThinWall {
    constructor(...args) {
        super(...args);
        this.name = "thin_top";
    }
    shouldBlockEntity(entity, direction, gameState) { return direction.isSouth(); }
    shouldBlockEntityExit(entity, direction, gameState) { return direction.isNorth(); }
}

export class ThinWallRight extends ThinWall {
    constructor(...args) {
        super(...args);
        this.name = "thin_right";
    }
    shouldBlockEntity(entity, direction, gameState) { return direction.isWest(); }
    shouldBlockEntityExit(entity, direction, gameState) { return direction.isEast(); }
}

export class ThinWallLeft extends ThinWall {
    constructor(...args) {
        super(...args);
        this.name = "thin_left";
    }
    shouldBlockEntity(entity, direction, gameState) { return direction.isEast(); }
    shouldBlockEntityExit(entity, direction, gameState) { return direction.isWest(); }
}

export class ThinWallLowerRight extends ThinWall {
    constructor(...args) {
        super(...args);
        this.name = "thin_lr";
    }
    shouldBlockEntity(entity, direction, gameState) { return direction.isWest() || direction.isNorth(); }
    shouldBlockEntityExit(entity, direction, gameState) { return direction.isEast() || direction.isSouth(); }
}
