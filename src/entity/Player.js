let {Entity} = require("./Entity");

export class Player extends Entity {
    constructor(...args) {
        super(...args);
        this.name = "player";
    }
    shouldBlockEntity(entity) {
        return false;
    }
};
