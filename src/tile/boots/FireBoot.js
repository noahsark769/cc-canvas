let { Boot } = require("./Boot");

export class FireBoot extends Boot {
    constructor(...args) {
        super(...args);
        this.bootName = "fire";
        this.name = "boots_fire";
    }
}
