let { Level } = require("./Level");

export class LevelSet {
    constructor(levels) {
        this.levels = levels || [];
    }
    addLevel(level) {
        this.levels.push(level);
    }
    get numLevels() {
        return this.levels.length;
    }
}

LevelSet.fromLevel = function(level) {
    return new LevelSet([level]);
}

LevelSet.fromSchematic = function(schematic) {
    return LevelSet.fromLevel(Level.buildFromSchematic(schematic));
}
