let {TileManager} = require("../../tile/TileManager");
let {EntityManager} = require("../../entity/EntityManager");
let {Entity} = require("../../entity/Entity");
let {Coordinate} = require("./Coordinate");
let {CoordinateMap} = require("./CoordinateMap");

export class CoordinateEntityMap extends CoordinateMap {
    constructor() {
        super();
        this.entityList = [];
    }
    serialize(entity, x, y) {
        return "" + entity.id + "-" + x + "-" + y;
    }
    deserialize(serialized) {
        let parts = serialized.split("-");
        parts = parts.map((value) => { return parseInt(value); });
        return [Entity.getById(parts[0]), parts[1], parts[2]];
    }
    newEntityInstanceByName(entityName, ...args) {
        let entityClass = EntityManager.getInstance().entityClassByName(entityName);
        if (entityClass === false) { return false; }
        let entityInstance = new entityClass(...args);
        return entityInstance;
    }
    setEntityByName(x, y, entityName, layer = 1) {
        let parts = entityName.split("-");
        let entityInstance;
        if (parts.length >= 3) {
            entityInstance = this.newEntityInstanceByName(parts[0], parts[2]);
        } else {
            entityInstance = this.newEntityInstanceByName(parts[0]);
        }
        if (parts.length >= 2) {
            entityInstance.state = parts[1];
        }
        if (entityInstance === false) {
            // console.warn("Could not set entity " + entityName + " into CoordinateTileMap because it was not found in the respective manager.");
            return false;
        }
        this.set(x, y, entityInstance, layer);
        return entityInstance;
    }
    set(x, y, entity, layer = 1) {
        super.set(x, y, entity, layer);
        this.entityList.push(this.serialize(entity, x, y));
    }
    move(x1, y1, x2, y2, layerSource = 1, layerDest = 1) {
        if (this.has(x1, y1)) {
            let entity = this.get(x1, y1, layerSource);
            let index = this.entityList.indexOf(this.serialize(entity, x1, y1));
            this.entityList[index] = this.serialize(entity, x2, y2);
            super.move(x1, y1, x2, y2, layerSource, layerDest);
        }
    }
    delete(x, y, layer = 1) {
        if (this.has(x, y, layer)) {
            let entity = this.get(x, y, layer);
            super.delete(x, y, layer);
            this.entityList.splice(this.entityList.indexOf(this.serialize(entity, x, y)), 1);
        }
    }
    *entitiesInOrder() {
        let entity, x, y;
        for (let serializedValue of this.entityList) {
            [entity, x, y] = this.deserialize(serializedValue);
            yield [entity, new Coordinate(x, y)];
        }
    }
}
