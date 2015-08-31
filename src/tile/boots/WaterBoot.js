let { Boot } = require("./Boot");

export class WaterBoot extends Boot {
    constructor(...args) {
        super(...args);
        this.bootName = "water";
        this.name = "boots_water";
    }
}
