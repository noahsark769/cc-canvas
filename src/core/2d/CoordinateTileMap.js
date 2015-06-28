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
        let entityInstance = new entityClass(renderer);
        return entityInstance;
    }
    newTileInstanceByName(tileName, renderer) {
        let tileClass = TileManager.getInstance().tileClassByName(tileName);
        let tileInstance = new tileClass(renderer);
        return tileInstance;
    }
    setTileByName(x, y, tileName, renderer = null) {
        if (renderer === null) {
            renderer = this.renderer;
        }
        let tileInstance = this.newTileInstanceByName(tileName, renderer);
        this.set(x, y, tileInstance);
        return tileInstance;
    }
    setEntityByName(x, y, entityName, renderer = null) {
        if (renderer === null) {
            renderer = this.renderer;
        }
        let entityInstance = this.newEntityInstanceByName(entityName, renderer);
        this.set(x, y, entityInstance);
        return entityInstance;
    }
}
