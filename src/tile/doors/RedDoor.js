let { Door } = require("./Door");

export class RedDoor extends Door {
    constructor(...args) {
        super(...args);
        this.color = "red";
        this.name = "door_red";
    }
}
