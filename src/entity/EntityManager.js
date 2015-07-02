let { Player } = require("./Player");
let { Bug } = require("./enemy/Bug");

let INSTANCE = null;

export const ENTITY_NAME_LIST = [
    "player",
    "bug"
];

export class EntityManager {
    constructor() {
        this.map = null;
    }

    buildEntityMap() {
        if (this.map !== null) { return; }
        this.map = new Map();

        this.map.set("player", Player);
        this.map.set("bug", Bug);
    }

    entityClassByName(name) {
        this.buildEntityMap();
        if (this.map.has(name)) {
            return this.map.get(name);
        }
        return false;
    }
};

EntityManager.getInstance = function() {
    if (INSTANCE !== null) { return INSTANCE; }
    INSTANCE = new EntityManager();
    return INSTANCE;
};
