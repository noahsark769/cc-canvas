let fs = require('fs');
// TODO: this import is hacky. should fix.
let {buildSpriteMap} = require("../animation/renderers/image/CCClassicImageRenderer");
let {LevelSet} = require("../core/LevelSet");
let {Level} = require("../core/Level");
let {Coordinate} = require("../core/2d/Coordinate");
let {ENTITY_NAME_LIST} = require("../entity/EntityManager");

// let logOffset = function(v, name, off) {
    // console.log("Found " + name + " to be 0x" + v.toString(16) + " (" + v.toString(10) + ")" + ". Move on to offset 0x" + off.toString(16) + "...");
// }

export function buildObjectCodeMap() {
    let spriteMap = buildSpriteMap();
    let objectMap = new Map();

    for (let [key, coordinate] of spriteMap.entries()) {
        if (coordinate.x * 16 + coordinate.y > 0x6F) {
            break;
        }
        objectMap.set(coordinate.x * 16 + coordinate.y, key);
    }
    return objectMap;
}

export class AbstractDatParser {
    // http://www.seasip.info/ccfile.html
    constructor(filename) {}

    parseToLevelSet() {
        this.consumeFile();
        return this.levelSet;
    }

    consumeFile() {
        let nextOffset = this.consumeMagic();
        let numLevels, level;

        [numLevels, nextOffset] = this.consumeNumLevels(nextOffset);
        for (let i = 0; i < numLevels; i++) {
            [level, nextOffset] = this.consumeLevel(nextOffset);
            this.levelSet.addLevel(level);
        }
    }

    consumeMagic() {
        let [result, nextOffset] = this.consumeLongAsNumber(0);
        if (result !== 0x0002AAAC && result !== 0x0102AAAC) {
            console.warn("File " + this.filename + " did not contain the magic number. May be corrupted.");
        }
        return nextOffset;
    }

    consumeNumLevels(offset) {
        let [numLevels, nextOffset] = this.consumeWordAsNumber(offset);
        return [numLevels, nextOffset];
    }

    consumeLevel(offset) {
        // levels are always 32x32
        let level = new Level(32, 32);
        this.currentLevel = level;
        let nextOffset, numLevelBytes, levelNumber, levelTime, chipsNeeded;

        [numLevelBytes, nextOffset] = this.consumeWordAsNumber(offset);
        let nextLevelOffset = nextOffset + numLevelBytes;

        [levelNumber, nextOffset] = this.consumeWordAsNumber(nextOffset);
        this.currentLevel.number = levelNumber;

        [levelTime, nextOffset] = this.consumeWordAsNumber(nextOffset);
        this.currentLevel.time = levelTime;

        [chipsNeeded, nextOffset] = this.consumeWordAsNumber(nextOffset);
        this.currentLevel.chipsNeeded = chipsNeeded;

        nextOffset = this.consumeLevelMapDetails(nextOffset);
        nextOffset = this.consumeLevelOptionalFields(nextOffset);

        return [this.currentLevel, nextLevelOffset];
    }

    consumeRunLengthEncoding(currentTileMarker, nextOffset, layer) {
        let repititions, tileCode;
        [repititions, nextOffset] = this.consumeByteAsNumber(nextOffset);
        [tileCode, nextOffset] = this.consumeByteAsNumber(nextOffset);
        currentTileMarker = this.consumeEntity(tileCode, repititions, currentTileMarker, layer);
        return [currentTileMarker, nextOffset];
    }

    consumeEntity(tileCode, num, currentTileMarker, layer) {
        let name = this.getObjectCodeValue(tileCode);
        // TODO: add an entity to the level based on name
        let x, y;
        for (let i = currentTileMarker; i < currentTileMarker + num; i++) {
            x = i % 32;
            y = Math.floor(i / 32);
            this.currentLevel.tileMap.setTileByName(
                x, // x goes across from top right
                y, // y goes down from top right
                name,
                layer
            );
            if (name.indexOf("player") !== -1) {
                this.currentLevel.setInitialPlayerPosition(new Coordinate(x, y));
            }
        }
        currentTileMarker += num;
        return currentTileMarker;
    }

    consumeLevelMapDetails(offset) {
        let [mapdetail, nextOffset] = this.consumeWordAsNumber(offset);
        if (mapdetail !== 1) {
            console.warn("Map detail (which was 0x" + mapdetail.toString(16) + ") was not 1, it should have been. We don't know what this means.");
        }

        let firstLayerBytes, objCode, secondLayerBytes, x, y;

        [firstLayerBytes, nextOffset] = this.consumeWordAsNumber(nextOffset);
        let endOfFirstLayerOffset = nextOffset + firstLayerBytes;

        let currentTileMarker = 0;
        while (nextOffset < endOfFirstLayerOffset) {
            [objCode, nextOffset] = this.consumeByteAsNumber(nextOffset);
            if (objCode === 0xFF) {
                [currentTileMarker, nextOffset] = this.consumeRunLengthEncoding(currentTileMarker, nextOffset, 1);
            } else {
                currentTileMarker = this.consumeEntity(objCode, 1, currentTileMarker, 1);
            }
        }

        [secondLayerBytes, nextOffset] = this.consumeWordAsNumber(nextOffset);
        let endOfSecondLayerOffset = nextOffset + secondLayerBytes;
        currentTileMarker = 0;
        while (nextOffset < endOfSecondLayerOffset) {
            [objCode, nextOffset] = this.consumeByteAsNumber(nextOffset);
            if (objCode === 0xFF) {
                [currentTileMarker, nextOffset] = this.consumeRunLengthEncoding(currentTileMarker, nextOffset, 2);
            } else {
                currentTileMarker = this.consumeEntity(objCode, 1, currentTileMarker, 2);
            }
        }

        return nextOffset;
    }

    consumeLevelOptionalFields(offset) {
        // hacky, but needed for multiple assignment/destructuring
        let nextOffset, optionalFieldBytes, fieldCode, fieldAdditionalBytes, mapTitle, numBytes,
            buttonX, buttonY, trapX, nothing, numBytesIncludingNull, asciiByte, mapHint;

        [optionalFieldBytes, nextOffset] = this.consumeWordAsNumber(offset);
        let endOfOptionalFieldsOffset = nextOffset + optionalFieldBytes;

        while (nextOffset < endOfOptionalFieldsOffset) {
            [fieldCode, nextOffset] = this.consumeByteAsNumber(nextOffset);
            [fieldAdditionalBytes, nextOffset] = this.consumeByteAsNumber(nextOffset);
            let nextFieldCodeOffset = nextOffset + fieldAdditionalBytes;

            switch (fieldCode) {
                case 3: // map title
                    [mapTitle, nextOffset] = this.consumeASCIIAsString(nextOffset, fieldAdditionalBytes, true);
                    this.currentLevel.title = mapTitle;
                    break;

                case 4: // trap controls
                    numBytes = fieldAdditionalBytes;
                    while (nextOffset < numBytes) {
                        [buttonX, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [buttonY, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [trapX, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [trapY, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [nothing, nextOffset] = this.consumeWordAsNumber(nextOffset);
                    }
                    // TODO: add trap wirings
                    break;

                case 5: // clone machine controls
                    numBytes = fieldAdditionalBytes;
                    while (nextOffset < numBytes) {
                        [buttonX, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [buttonY, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [trapX, nextOffset] = this.consumeWordAsNumber(nextOffset);
                        [trapY, nextOffset] = this.consumeWordAsNumber(nextOffset);
                    }
                    // TODO: add clone machine wirings
                    break;

                case 6: // map password encrypted
                    numBytesIncludingNull = fieldAdditionalBytes;
                    let endOfPasswordOffset = nextOffset + numBytesIncludingNull;
                    let pw = "";
                    while (nextOffset < endOfPasswordOffset) {
                        [asciiByte, nextOffset] = this.consumeByteAsNumber(nextOffset);
                        if (asciiByte == 0) { continue; }
                        pw += String.fromCharCode(asciiByte ^ 0x99);
                    }
                    break;

                case 7: // map hint
                    [mapHint, nextOffset] = this.consumeASCIIAsNullTerminatedString(nextOffset);
                    this.currentLevel.hint = mapHint;
                    break;

                case 8: // map password, plaintext
                    console.warn("We haven't implemented parsing map password plaintext. The parser will probs break.");
                    nextOffset += fieldAdditionalBytes;
                    break; // TODO: CHIPS.DAT doesn't use this, but we may need it to play DATs generated by others?

                case 10: // monster movements
                    let endOfMovementsOffset = nextOffset + fieldAdditionalBytes;
                    while (nextOffset < endOfMovementsOffset) {
                        [x, nextOffset] = this.consumeByteAsNumber(nextOffset);
                        [y, nextOffset] = this.consumeByteAsNumber(nextOffset);
                        this.level.movements.append(new Coordinate(x, y));
                    }
                    break;

                default:
                    break;
            }
            nextOffset = nextFieldCodeOffset;
        }
    }

    getObjectCodeValue(code) {
        if (this.objectMap === null) { this.objectMap = buildObjectCodeMap(); }
        if (this.objectMap.has(code)) {
            let returnValue = this.objectMap.get(code);
            return returnValue;
        } else {
            console.warn("Parser objectMap did not have code " + code + ". Something may be weird after this.");
            return "NONE";
        }
    }

    // note: LITTLE endian!!
    consumeWordAsNumber(offset) {}
    consumeLongAsNumber(offset) {}
    consumeByteAsNumber(offset) {}
    consumeASCIIAsString(offset, length, includesNullTerminator = true) {}
    consumeASCIIAsNullTerminatedString(offset) {}
}
