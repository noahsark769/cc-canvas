let { Boot } = require("./Boot");

export class IceBoot extends Boot {
    constructor(...args) {
        super(...args);
        this.bootName = "ice";
        this.name = "boots_ice";
    }
}
