const enumValue = (name) => Object.freeze({toString: () => name});

function makeEnum(name, values) {
    var obj = {};
    for (let value of values) {
        obj[value] = enumValue(`${name}.${value}`);
    }
    return Object.freeze(obj);
}

const SlipTypeRaw = makeEnum("PlayerSlipType", ["ICE", "FORCE", "TELEPORT"]);

export class SlipType {
    constructor(raw) {
        this.value = raw;
    }

    shouldBounceBackward() {
        return this.value === SlipTypeRaw.ICE;
    }

    directionsPlayerCanCancel(currentSlipDirection) {
        if (this.value === SlipTypeRaw.FORCE) {
            return [currentSlipDirection.clockwise(), currentSlipDirection.counterclockwise()];
        }
        return [];
    }

    toString() {
        return `<SlipType ${this.value}>`;
    }
}

let singletons = {};
singletons[SlipTypeRaw.FORCE] = new SlipType(SlipTypeRaw.FORCE);
singletons[SlipTypeRaw.TELEPORT] = new SlipType(SlipTypeRaw.TELEPORT);
singletons[SlipTypeRaw.ICE] = new SlipType(SlipTypeRaw.ICE);

SlipType.force = function() { return singletons[SlipTypeRaw.FORCE] }
SlipType.ice = function() { return singletons[SlipTypeRaw.ICE] }
SlipType.teleport = function() { return singletons[SlipTypeRaw.TELEPORT] }