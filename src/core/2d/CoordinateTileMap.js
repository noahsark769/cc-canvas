let {TileManager} = require("../../tile/TileManager");
let {EntityManager} = require("../../entity/EntityManager");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateTileMap extends CoordinateMap {
    constructor() {
        super();
    }
    newEntityInstanceByName(entityName) {
        let entityClass = EntityManager.getInstance().entityClassByName(entityName);
        if (entityClass === false) { return false; }
        let entityInstance = new entityClass();
        return entityInstance;
    }
    newTileInstanceByName(tileName) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        if (tileClass === false) { return false; }
        let tileInstance = new tileClass();
        return tileInstance;
    }
    setTileByName(x, y, tileName, layer = 1) {
        let tileInstance = this.newTileInstanceByName(tileName);
        if (tileInstance === false) {
            // console.warn("Could not set tile " + tileName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, tileInstance, layer);
        return tileInstance;
    }
    setEntityByName(x, y, entityName, layer = 1) {
        let parts = entityName.split("-");
        let entityInstance = this.newEntityInstanceByName(parts[0]);
        if (parts.length >= 2) {
            entityInstance.state = parts[1];
        }
        if (parts.length >= 3) {
            entityInstance.direction = parts[2];
        }
        if (entityInstance === false) {
            // console.warn("Could not set entity " + entityName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, entityInstance, layer);
        return entityInstance;
    }
}
