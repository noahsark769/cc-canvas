let {Direction} = require("../../core/2d/directions");
let {Monster, MonsterStateTile} = require("./Monster");

// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export class Blob extends Monster {
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
    chooseMove(gameState) {
        if (gameState.currentTicks % 4 !== 0) {
            return [false, false];
        }
        return super.chooseMove(gameState);
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
