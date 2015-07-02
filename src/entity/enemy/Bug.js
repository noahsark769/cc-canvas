let {NORTH, SOUTH, EAST, WEST, Direction} = require("../../core/2d/directions");
let {Enemy} = require("./Enemy");

export class Bug extends Enemy {
    constructor(...args) {
        super(...args);
        this.name = "bug";
    }
    chooseMove(tileMap, entityMap, gameState, coordinate) {
        let dirsToTry = [
            this.direction.counterclockwise(),
            this.direction,
            this.direction.clockwise(),
            this.direction.clockwise().clockwise()
        ];

        let newCoord;
        for (let dir of dirsToTry) {
            newCoord = dir.coordinateFor(coordinate, 1);
            if (
                (entityMap.has(newCoord.x, newCoord.y) && entityMap.get(newCoord.x, newCoord.y).shouldBlockEntity(this)) ||
                (tileMap.has(newCoord.x, newCoord.y) && tileMap.get(newCoord.x, newCoord.y).shouldBlockEntity(this)) ||
                newCoord.x < 0 || newCoord.y < 0 || newCoord.x >= gameState.level.width || newCoord.y >= gameState.level.height
            ) {
                continue;
            } else {
                // now we're gunna occupy the actual coordinate
                return [newCoord, dir];
            }
        }
        return false;
    }
}
