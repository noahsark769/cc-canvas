let { Player } = require("./Player");

let INSTANCE = null;

export class EntityManager {
    constructor() {
        this.map = null;
    }

    buildEntityMap() {
        if (this.map !== null) { return; }
        this.map = new Map();

        this.map.set("player", Player);
    }

    entityClassByName(name) {
        this.buildEntityMap();
        return this.map.get(name);
    }
};

EntityManager.getInstance = function() {
    if (INSTANCE !== null) { return INSTANCE; }
    INSTANCE = new EntityManager();
    return INSTANCE;
};
