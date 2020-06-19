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
}

SlipType.force = function() { return new SlipType(SlipTypeRaw.FORCE); }
SlipType.ice = function() { return new SlipType(SlipTypeRaw.ICE); }
SlipType.teleport = function() { return new SlipType(SlipTypeRaw.TELEPORT); }