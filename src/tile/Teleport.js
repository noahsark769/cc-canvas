let { Tile } = require("./Tile");
import { SlipType } from "../entity/SlipType";

export class Teleport extends Tile {
    constructor(...args) {
        super(...args);
        this.name = "teleport";
    }

    directionForEntityToSlip(entity, direction, gameState) {
        return direction;
    }

    slipTypeForPlayer(entity, gameState) {
        return SlipType.teleport();
    }
}