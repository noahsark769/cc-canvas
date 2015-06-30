let { Key } = require("./Key");

export class GreenKey extends Key {
    constructor(...args) {
        super(...args);
        this.color = "green";
        this.name = "key_green";
    }
}
