let fs = require('fs');
let {LevelSet} = require("../core/LevelSet");
let {AbstractDatParser} = require("./AbstractDatParser");

export class FSDatParser extends AbstractDatParser {
    // http://www.seasip.info/ccfile.html
    constructor(filename) {
        super();
        this.filename = filename;
        this.buffer = fs.readFileSync(this.filename);
        this.objectMap = null;
        this.levelSet = new LevelSet();
    }

    // note: LITTLE endian!!
    consumeWordAsNumber(offset) {
        let result = this.buffer.readUInt16LE(offset >>> 0);
        return [result, offset + 2];
    }
    consumeLongAsNumber(offset) {
        let result = this.buffer.readUInt32LE(offset >>> 0);
        return [result, offset + 4];
    }
    consumeByteAsNumber(offset) {
        let result = this.buffer.readUInt8(offset >>> 0);
        return [result, offset + 1];
    }
    consumeASCIIAsString(offset, length, includesNullTerminator = true) {
        let end = includesNullTerminator ? offset + length - 1 : offset + length;
        let result = this.buffer.toString("ascii", offset, end);
        return [result, offset + length];
    }
    consumeASCIIAsNullTerminatedString(offset) {
        let s = "";
        let pos = offset;
        let byte = this.buffer.readUInt8(pos);
        while (byte != 0) {
            s += String.fromCharCode(byte);
            pos++;
            byte = this.buffer.readUInt8(pos);
        }
        return [s, offset + s.length + 1];
    }
}
