let fs = require('fs');
let {LevelSet} = require("../core/LevelSet");
let {AbstractDatParser} = require("./AbstractDatParser");

// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String?hl=en
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export class FileReaderDatParser extends AbstractDatParser {
    // http://www.seasip.info/ccfile.html
    constructor(arrayBuffer) {
        super();
        this.buffer = arrayBuffer;
        this.objectMap = null;
        this.levelSet = new LevelSet();
    }

    // note: LITTLE endian!!
    consumeWordAsNumber(offset) {
        let view = new Uint16Array(this.buffer.slice(offset, offset + 2));
        let result = view[0];
        return [result, offset + 2];
    }
    consumeLongAsNumber(offset) {
        let view = new Uint32Array(this.buffer.slice(offset, offset + 4));
        let result = view[0];
        return [result, offset + 4];
    }
    consumeByteAsNumber(offset) {
        let view = new Uint8Array(this.buffer.slice(offset, offset + 1));
        let result = view[0];
        return [result, offset + 1];
    }
    consumeASCIIAsString(offset, length, includesNullTerminator = true) {
        let end = includesNullTerminator ? offset + length - 1 : offset + length;
        let result = ab2str(this.buffer.slice(offset, end));
        return [result, offset + length];
    }
    consumeASCIIAsNullTerminatedString(offset) {
        let s = "";
        let pos = offset;
        let view = new Uint8Array(this.buffer.slice(pos, pos + 1));
        let byte = view[0];
        while (byte != 0) {
            s += String.fromCharCode(byte);

            pos++;
            view = new Uint8Array(this.buffer.slice(pos, pos + 1));
            byte = view[0];
        }
        return [s, offset + s.length + 1];
    }
}
