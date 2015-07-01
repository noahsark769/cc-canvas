let { Floor } = require("./Floor");
let { Wall } = require("./Wall");
let { Chip } = require("./Chip");
let { Escape } = require("./Escape");
let { Socket } = require("./Socket");
let { BlueKey } = require("./keys/BlueKey");
let { RedKey } = require("./keys/RedKey");
let { YellowKey } = require("./keys/YellowKey");
let { GreenKey } = require("./keys/GreenKey");
let { BlueDoor } = require("./doors/BlueDoor");
let { RedDoor } = require("./doors/RedDoor");
let { YellowDoor } = require("./doors/YellowDoor");
let { GreenDoor } = require("./doors/GreenDoor");

let INSTANCE = null;

export class TileManager {
    constructor() {
        this.map = null;
    }

    buildTileMap() {
        if (this.map !== null) { return; }
        this.map = new Map();

        this.map.set("floor", Floor);
        this.map.set("wall", Wall);
        this.map.set("chip", Chip);
        this.map.set("escape", Escape);
        this.map.set("socket", Socket);
        this.map.set("key_blue", BlueKey);
        this.map.set("key_red", RedKey);
        this.map.set("key_yellow", YellowKey);
        this.map.set("key_green", GreenKey);
        this.map.set("door_blue", BlueDoor);
        this.map.set("door_red", RedDoor);
        this.map.set("door_yellow", YellowDoor);
        this.map.set("door_green", GreenDoor);
    }

    tileClassByName(name) {
        this.buildTileMap();
        if (this.map.has(name)) {
            return this.map.get(name);
        }
        return false;
    }
};

TileManager.getInstance = function() {
    if (INSTANCE !== null) { return INSTANCE; }
    INSTANCE = new TileManager();
    return INSTANCE;
};
