let reqlib = require("app-root-path").require;
let sinon = require("sinon");
let {GameState} = reqlib("/src/core/GameState");
let {Level} = reqlib("/src/core/Level");
let {CCClassicImageRenderer} = reqlib("/src/animation/renderers/image/CCClassicImageRenderer");

/**
 * Return an object representing the intrface of the DOM document
 * object, for all the purposes we need it for. Useful for testing the
 * DocumentInterface object.
 * @return {object} the mock object
 */
export function getMockDocument() {
    return {
        getElementById: sinon.stub().returns({}),
        addEventListener: sinon.spy(),
        write: sinon.spy()
    };
}

/**
 * Return an object representing the interface of the DOM canvas element,
 * at least insofar as we need it for testing the Animator.
 * @return {object} the mock object
 */
export function getMockCanvas(spy = null) {
    if (spy === null) { spy = sinon.spy(); }
    return {
        getContext: function () {
            return {
                drawImage: spy,
                clearRect: sinon.spy()
            }
        }
    }
}

export function stopTickingDebugger() {
    if (window) {
        window.GameEngine.getInstance().stopTicking();
        debugger;
    }
}

export function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let level = Level.buildFromSchematic(schematic);
    state.setLevel(level);
    return [state, level];
}
