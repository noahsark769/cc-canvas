let { Door } = require("./Door");

export class YellowDoor extends Door {
    constructor(...args) {
        super(...args);
        this.color = "yellow";
        this.name = "door_yellow";
    }
}
