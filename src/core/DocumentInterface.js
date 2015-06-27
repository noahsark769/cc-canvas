/**
 * DocumentInterface is a class which represents all the functions that the
 * game needs to know about which relate to processing the DOM. Things like
 * obtaining the canvas instance, setting event listeners for arrow key presses,
 * etc.
 */
export class DocumentInterface {
    constructor() {}

    /**
     * Return the canvas object, or null if it does not exist.
     * @return {Element} the canvas
     */
    getCanvas() {
        if (this.canvas) { return this.canvas; }
        this.canvas = document.getElementById("main-canvas");
        return this.canvas;
    }
}
