let { Door } = require("./Door");

export class BlueDoor extends Door {
    constructor(...args) {
        super(...args);
        this.color = "blue";
        this.name = "door_blue";
    }
}
