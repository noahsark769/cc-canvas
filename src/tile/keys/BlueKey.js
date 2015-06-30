let { Key } = require("./Key");

export class BlueKey extends Key {
    constructor(...args) {
        super(...args);
        this.color = "blue";
        this.name = "key_blue";
    }
}
