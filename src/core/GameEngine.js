let {Animator} = require("../animation/Animator");
let {GameState} = require("./GameState");
let {DocumentInterface} = require("../core/DocumentInterface");

/**
 * GameEngine is a singleton class. This is the instance of the class, or
 * null if no GameEngine has yet been established. This will be set by the
 * GameEngine constructor when the first (and only) instance is constructed.
 * @type {GameEngine|null}
 */
let SINGLETON_INSTANCE = null;

/**
 * The number of milliseconds between ticks in the game engine.
 *
 * In the game engine, how it works is that the player can move with a
 * certain interval, and all else proceeds forward via ticks in time: one
 * tick means an enemy moves one space forward, basically (though it could
 * be extended to include other mechanics).
 *
 * The engine controls ticks happening at a certain interval. This is that
 * interval, in milliseconds. Note: this is not a gaurantee that play will
 * always proceed at this exact interval - this just represents the offset
 * between calculations of every tick. If we're fast enough, then the ticks
 * will happen at a reasonable rate.
 * @type {Number}
 */
let TICK_INTERVAL = 100; // one tenth of a second, see http://chips.kaseorg.com/faq/cache/86.html


/**
 * GameEngine is the main class which organizies all aspects of the game. Though
 * sometimes only a proxy to other methods of Animator, GameState, etc, the
 * GameEngine is the top level of the object hierarchy that represents the
 * game currently running.
 *
 * GameEngine is a singleton - there can only ever be one GameEngine per page
 * load. As such, it should only be accessed with GameEngine.getInstance().
 */
export class GameEngine {
    constructor(document, canvas = null) {
        this.documentInterface = new DocumentInterface(document);
        if (canvas === null) {
            canvas = this.documentInterface.getCanvas()
        }
        this.documentInterface.registerKeypresses(document, this);
        this.animator = new Animator(canvas);
        this.gameState = new GameState();
        this.intervalId = null;
        this.started = false;
        this.paused = false;
        SINGLETON_INSTANCE = this;

        this.pendingPlayerMovement = null;
        this.playerMovedOnLastTick = false;
    }

    enqueuePlayerMovement(movement) {
        this.pendingPlayerMovement = movement;
    }

    tick() {
        if (this.paused) { return; }
        if (this.pendingPlayerMovement === null) {
            this.playerMovedOnLastTick = false;
        } else {
            if (this.pendingPlayerMovement !== null && !this.playerMovedOnLastTick) {
                this.gameState["movePlayer" + this.pendingPlayerMovement.charAt(0).toUpperCase() + this.pendingPlayerMovement.slice(1)]();
                this.pendingPlayerMovement = null;
                this.playerMovedOnLastTick = true;
            } else {
                this.playerMovedOnLastTick = false;
            }
        }
        // rerender the canvas
        if (this.animator !== null && this.gameState.level !== null) {
            this.animator.clear();
            this.animator.renderViewport(this.gameState.getViewport(), this.gameState);
        }
        this.gameState.tick();
    }

    // for testing purposes only
    step() {
        this.tick();
        this.tick();
    }

    pause(shouldStopTicking = false) {
        if (shouldStopTicking) {
            this.stopTicking();
        }
        this.paused = true;
    }

    unpause(shouldStartTicking = false) {
        if (shouldStartTicking) {
            this.startTicking();
        }
        this.paused = false;
    }

    togglePause(toggleTicking = false) {
        if (this.paused) {
            this.unpause(toggleTicking);
        } else {
            this.pause(toggleTicking);
        }
    }

    startTicking() {
        this.intervalId = setInterval(() => {
            this.tick();
        }, TICK_INTERVAL);
    }

    stopTicking() {
        clearInterval(this.intervalId);
    }

    startGameplay() {
        this.startTicking();
        this.started = true;
    }
}

/**
 * Return the singleton instance of the GameEngine, or create one and return it
 * if none already exists.
 * @return {GameEngine} the singleton engine
 */
GameEngine.getInstance = (document, canvas = null) => {
    if (SINGLETON_INSTANCE !== null) {
        return SINGLETON_INSTANCE;
    }
    console.log("CANVAS 1: " + canvas);
    SINGLETON_INSTANCE = new GameEngine(document, canvas);
    return SINGLETON_INSTANCE;
};

GameEngine.reset = (document, canvas = null) => {
    SINGLETON_INSTANCE = new GameEngine(document, canvas);
    return SINGLETON_INSTANCE;
};

// if (window) {
//     window.GameEngine = GameEngine;
// }
