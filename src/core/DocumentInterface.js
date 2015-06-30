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
    constructor(document) {
        this.document = document;
        this.chipsLeft = -1;
    }

    /**
     * Return the canvas object, or null if it does not exist.
     * @param {Document} the document element
     * @return {Element} the canvas
     */
    getCanvas(document) {
        if (this.canvas) { return this.canvas; }
        this.canvas = this.document.getElementById("main-canvas");
        return this.canvas;
    }

    registerKeypresses(document, gameEngine) {
        document.addEventListener("keydown", (e) => {
            if (e.keyCode) {
                switch(e.keyCode) {
                    case 37: // left
                        gameEngine.enqueuePlayerMovement("left");
                        break;
                    case 38: // up
                        gameEngine.enqueuePlayerMovement("up");
                        break;
                    case 39: // right
                        gameEngine.enqueuePlayerMovement("right");
                        break;
                    case 40: // down
                        gameEngine.enqueuePlayerMovement("down");
                        break;
                    default:
                        break;
                }
            }
        });
    }
    updateChipsLeft(chipsLeft) {
        if (chipsLeft !== this.chipsLeft) {
            this.chipsLeft = chipsLeft;
            this.document.getElementById("chips-left").innerHTML = this.chipsLeft;
        }
    }
    updateTicks(ticks) {
        this.document.getElementById("engine-ticks").innerHTML = ticks;
    }
    updateEngineState(state) {
        this.document.getElementById("engine-state").innerHTML = state;
    }
    showWin() {
        console.log("WIN!!");
    }
}
