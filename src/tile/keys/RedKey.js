let { Key } = require("./Key");

export class RedKey extends Key {
    constructor(...args) {
        super(...args);
        this.color = "red";
        this.name = "key_red";
    }
}
