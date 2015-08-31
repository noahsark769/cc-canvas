let { Floor } = require("./Floor");
let { Wall } = require("./Wall");
let { Water } = require("./Water");
let { Fire } = require("./Fire");
let { Chip } = require("./Chip");
let { Escape } = require("./Escape");
let { Socket } = require("./Socket");
let { Hint } = require("./Hint");
let { BlueKey } = require("./keys/BlueKey");
let { RedKey } = require("./keys/RedKey");
let { YellowKey } = require("./keys/YellowKey");
let { GreenKey } = require("./keys/GreenKey");
let { BlueDoor } = require("./doors/BlueDoor");
let { RedDoor } = require("./doors/RedDoor");
let { YellowDoor } = require("./doors/YellowDoor");
let { GreenDoor } = require("./doors/GreenDoor");
let { ThinWallBottom, ThinWallTop, ThinWallLeft, ThinWallRight, ThinWallLowerRight } = require("./ThinWall");
import { BlueWallFake, BlueWallReal } from "./BlueWall";
import { Bomb } from "./Bomb";
import { Cement } from "./Cement";
import { Dirt } from "./Dirt";
import { InvisibleWall, InvisibleWallAppearing } from "./InvisibleWall";
let { PlayerDeadFire, PlayerDeadWater, PlayerDeadCharred, PlayerSouth, PlayerNorth, PlayerWest, PlayerEast, PlayerSwimSouth, PlayerSwimEast, PlayerSwimWest, PlayerSwimNorth } = require("../entity/Player");
let { BugNorth, BugSouth, BugEast, BugWest } = require("../entity/enemy/Bug");
let { FireballNorth, FireballSouth, FireballEast, FireballWest } = require("../entity/enemy/Fireball");
let { GliderNorth, GliderSouth, GliderEast, GliderWest } = require("../entity/enemy/Glider");
let { ParameciumNorth, ParameciumSouth, ParameciumEast, ParameciumWest } = require("../entity/enemy/Paramecium");
let { BallNorth, BallSouth, BallEast, BallWest } = require("../entity/enemy/Ball");
let { BlobNorth, BlobSouth, BlobEast, BlobWest } = require("../entity/enemy/Blob");
let { WalkerNorth, WalkerSouth, WalkerEast, WalkerWest } = require("../entity/enemy/Walker");
let { TeethNorth, TeethSouth, TeethEast, TeethWest } = require("../entity/enemy/Teeth");
import { BlockTile } from "../entity/Block";

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
        this.map.set("hint", Hint);
        this.map.set("key_blue", BlueKey);
        this.map.set("key_red", RedKey);
        this.map.set("key_yellow", YellowKey);
        this.map.set("key_green", GreenKey);
        this.map.set("door_blue", BlueDoor);
        this.map.set("door_red", RedDoor);
        this.map.set("door_yellow", YellowDoor);
        this.map.set("door_green", GreenDoor);
        this.map.set("block", BlockTile);

        for (let tileClass of [Water, Fire]) {
            this.map.set((new tileClass()).name, tileClass);
        }

        for (let tileClass of [ThinWallBottom, ThinWallTop, ThinWallLeft, ThinWallRight, ThinWallLowerRight]) {
            this.map.set((new tileClass()).name, tileClass);
        }

        for (let tileClass of [BlueWallFake, BlueWallReal, Bomb, Cement, Dirt, InvisibleWall, InvisibleWallAppearing]) {
            this.map.set((new tileClass()).name, tileClass);
        }

        // monsters
        for (let tileClass of [PlayerDeadFire, PlayerDeadWater, PlayerDeadCharred, PlayerSouth, PlayerNorth, PlayerWest, PlayerEast, PlayerSwimSouth, PlayerSwimEast, PlayerSwimWest, PlayerSwimNorth]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [BugNorth, BugSouth, BugEast, BugWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [FireballNorth, FireballSouth, FireballEast, FireballWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [GliderNorth, GliderSouth, GliderEast, GliderWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [ParameciumNorth, ParameciumSouth, ParameciumEast, ParameciumWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [BallNorth, BallSouth, BallEast, BallWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [BlobNorth, BlobSouth, BlobEast, BlobWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [WalkerNorth, WalkerSouth, WalkerEast, WalkerWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
        for (let tileClass of [TeethNorth, TeethSouth, TeethEast, TeethWest]) {
            this.map.set((new tileClass()).name, tileClass);
        }
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
