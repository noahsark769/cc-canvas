let { Player } = require("./Player");
let { Bug } = require("./enemy/Bug");
let { Fireball } = require("./enemy/Fireball");
let { Glider } = require("./enemy/Glider");
let { Paramecium } = require("./enemy/Paramecium");

let INSTANCE = null;

export const ENTITY_NAME_LIST = [
    "player",
    "bug",
    "fireball",
    "glider",
    "paramecium"
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
        this.map.set("fireball", Fireball);
        this.map.set("glider", Glider);
        this.map.set("paramecium", Paramecium);
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
