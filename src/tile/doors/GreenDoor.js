let { Door } = require("./Door");

export class GreenDoor extends Door {
    constructor(...args) {
        super(...args);
        this.color = "green";
        this.name = "door_green";
    }
}
