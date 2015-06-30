let reqlib = require("app-root-path").require;
let sinon = require("sinon");
let {GameState} = reqlib("/src/core/GameState");
let {LevelBuilder} = reqlib("/src/util/LevelBuilder");
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
        addEventListener: sinon.spy()
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

export function buildSimpleLevelWithPlayerAt(width, height, defaultTile, playerX, playerY, maybeState, maybeRenderer) {
    let state = maybeState || new GameState();
    let renderer = maybeRenderer || new CCClassicImageRenderer(sinon.spy(), function() {});
    let builder = new LevelBuilder(width, height, defaultTile);
    builder.setRenderer(renderer);
    builder.addEntityAt(playerX, playerY, "player");
    let level = builder.generateLevel();
    state.setLevel(level);
    state.setPlayerPosition(playerX, playerY);
    return [state, level];
}
