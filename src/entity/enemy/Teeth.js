let {Direction} = require("../../core/2d/directions");
let {SlowMonster, MonsterStateTile} = require("./Monster");
let {shuffle} = require("../../util/random");

export class Teeth extends SlowMonster {
    constructor(...args) {
        super(...args);
        this.name = "teeth";
    }

    getDirectionsInOrder(gameState) {
        if (!gameState.player) { return []; }
        let target = gameState.player.position;
        let [nsDir, nsDistance] = this.position.getManhattanNS(target);
        let [ewDir, ewDistance] = this.position.getManhattanEW(target);
        if (nsDistance === 0 && ewDistance === 0) { return []; }
        let options = nsDistance >= ewDistance ? [nsDir, ewDir] : [ewDir, nsDir];
        let result = [];
        for (let option of options) {
            if (option.coordinateFor(this.position, 1).distanceTo(target) < this.position.distanceTo(target)) {
                result.push(option);
            }
        }
        return result;
    }
}

export class TeethSouth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "teeth-south";
    }
}

export class TeethNorth extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "teeth-north";
    }
}

export class TeethEast extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "teeth-east";
    }
}

export class TeethWest extends MonsterStateTile {
    constructor(...args) {
        super(...args);
        this.name = "teeth-west";
    }
}
