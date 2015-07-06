let {FileReaderDatParser} = require("../data/FileReaderDatParser");

/**
 * DocumentInterface is a class which represents all the functions that the
 * game needs to know about which relate to processing the DOM. Things like
 * obtaining the canvas instance, setting event listeners for arrow key presses,
 * etc.
 */
export class DocumentInterface {
    /**
     * Construct the document interface instance with a reference to the
     * document. We pass this in here instead of assuming a global document
     * in order to make testing easier. Dependency injection!
     */
    constructor(window) {
        this.window = window;
        this.document = window.document;
        this.chipsLeft = -1;
        this.cache = new Map();
        this.cache.set("chipsLeft", -1);
        this.cache.set("engineState", undefined);
    }

    /**
     * Return the canvas object, or null if it does not exist.
     * @param {Document} the document element
     * @return {Element} the canvas
     */
    getCanvas() {
        if (this.canvas) { return this.canvas; }
        this.canvas = this.document.getElementById("main-canvas");
        return this.canvas;
    }

    register(engine) {
        this.window.CC_ENGINE = engine;
        this.document.getElementById("levelset-input").addEventListener("change", (event) => {
            let files = event.currentTarget.files;
            if (!files || files.length !== 1) {
                return;
            }
            let reader = new this.window.FileReader();
            reader.onload = function () {
                let arrayBuffer = reader.result;
                let parser = new FileReaderDatParser(arrayBuffer);
                engine.loadLevelSet(parser.parseToLevelSet());
            };
            reader.readAsArrayBuffer(files[0]);
        });
        this.document.addEventListener("keydown", (e) => {
            if (e.keyCode) {
                switch(e.keyCode) {
                    case 37: // left
                        engine.enqueuePlayerMovement("left");
                        break;
                    case 38: // up
                        engine.enqueuePlayerMovement("up");
                        break;
                    case 39: // right
                        engine.enqueuePlayerMovement("right");
                        break;
                    case 40: // down
                        engine.enqueuePlayerMovement("down");
                        break;
                    default:
                        break;
                }
            }
        });
        document.getElementById("level-next").addEventListener("click", () => {
            engine.loadNextLevel();
        });
        document.getElementById("level-prev").addEventListener("click", () => {
            engine.loadPreviousLevel();
        });
        document.getElementById("level-reset").addEventListener("click", () => {
            engine.resetCurrentLevel();
        });
        engine.documentInterface = this;
        return this;
    }
    update(engine) {
        if (engine.gameState.chipsLeft !== this.cache.get("chipsLeft")) {
            this.cache.set("chipsLeft", engine.gameState.chipsLeft);
            this.document.getElementById("chips-left").innerHTML = engine.gameState.chipsLeft;
        }
        this.document.getElementById("engine-ticks").innerHTML = engine.gameState.currentTicks;
        if (engine.state !== this.cache.get("engineState")) {
            this.cache.set("engineState", engine.state)
            this.document.getElementById("engine-state").innerHTML = engine.state;
        }
    }
    showWin() {
        console.log("WIN!!");
    }
    showLoss() {
        alert("Bummer!");
        console.log("BUMMER");
    }
    showHint(hint) {
        this.document.getElementById("level-hint").innerHTML = hint;
    }
    hideHint() {
        this.document.getElementById("level-hint").innerHTML = "";
    }
}
