let {TileManager} = require("../../tile/TileManager");
let {EntityManager} = require("../../entity/EntityManager");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateTileMap extends CoordinateMap {
    constructor(renderer = null) {
        super();
        this.renderer = renderer;
    }
    newEntityInstanceByName(entityName, renderer) {
        let entityClass = EntityManager.getInstance().entityClassByName(entityName);
        if (entityClass === false) { return false; }
        let entityInstance = new entityClass(renderer);
        return entityInstance;
    }
    newTileInstanceByName(tileName, renderer) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        if (tileClass === false) { return false; }
        let tileInstance = new tileClass(renderer);
        return tileInstance;
    }
    setTileByName(x, y, tileName, renderer = null) {
        if (renderer === null) {
            renderer = this.renderer;
        }
        let tileInstance = this.newTileInstanceByName(tileName, renderer);
        if (tileInstance === false) {
            console.warn("Could not set tile/entity " + tileName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, tileInstance);
        return tileInstance;
    }
    setEntityByName(x, y, entityName, renderer = null) {
        if (renderer === null) {
            renderer = this.renderer;
        }
        let entityInstance = this.newEntityInstanceByName(entityName, renderer);
        if (entityInstance === false) {
            console.warn("Could not set tile/entity " + entityName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, entityInstance);
        return entityInstance;
    }
}
