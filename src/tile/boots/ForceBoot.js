let { Boot } = require("./Boot");

export class ForceBoot extends Boot {
    constructor(...args) {
        super(...args);
        this.bootName = "force";
        this.name = "boots_force";
    }
}
