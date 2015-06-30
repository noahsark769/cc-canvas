let { Key } = require("./Key");

export class YellowKey extends Key {
    constructor(...args) {
        super(...args);
        this.color = "yellow";
        this.name = "key_yellow";
    }
}
