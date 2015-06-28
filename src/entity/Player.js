let {Entity} = require("./Entity");

export class Player extends Entity {
    constructor(...args) {
        super(...args);
        this.state = null;
        this.name = "player";
    }
};
