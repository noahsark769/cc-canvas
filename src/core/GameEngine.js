let {Animator} = require("../animation/Animator");
let {GameState} = require("./GameState");
let {DocumentInterface} = require("../core/DocumentInterface");

// game engine states
export const IDLE = "idle"; // no levelset has yet been loaded
export const LEVEL_SET_COMPLETE = "level-set-complete"; // the player won the entire game.
export const PAUSED = "paused"; // the game is paused
export const LEVEL_ACTIVE = "level-active"; // the game is currently being played.
export const LEVEL_COMPLETE = "level-complete"; // the player just completed a level or died from a level
export const LEVEL_READY = "level-ready"; // the level and level set are loaded but the player has not started the level

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
    constructor(document, canvas = null, useIntervals = false) {
        this.useIntervals = useIntervals;
        this.state = IDLE;
        this.documentInterface = new DocumentInterface(document);
        if (canvas === null) {
            canvas = this.documentInterface.getCanvas()
        }
        this.documentInterface.registerKeypresses(document, this);
        this.animator = new Animator(canvas);
        this.gameState = new GameState();
        this.intervalId = null;
        SINGLETON_INSTANCE = this;

        this.pendingPlayerMovement = null;
        this.playerMovedOnLastTick = false;

        this.levelSet = null;
        this.currentLevelInSet = 0;
    }

    loadLevelSet(levelSet) {
        this.levelSet = levelSet;
        this.stopTicking();
        this.gameState.reset();
        if (this.levelSet.numLevels === 0) {
            console.warn("Trying to input a levelSet with 0 levels");
        }
        this.gameState.setLevel(this.levelSet.levels[0]);
        this.currentLevelInSet = 0;
        this.state = LEVEL_READY;
        if (this.animator) {
            this.animator.clear();
            this.animator.renderViewport(this.gameState.getViewport(), this.gameState);
        }
        this.documentInterface.updateTicks(this.gameState.currentTicks);
        this.documentInterface.updateEngineState(this.state);
    }

    loadNextLevel() {
        this.stopTicking();
        if (this.currentLevelInSet + 1 >= this.levelSet.numLevels) {
            this.state = LEVEL_SET_COMPLETE;
        } else {
            this.gameState.reset();
            this.currentLevelInSet++;
            this.gameState.setLevel(this.levelSet.levels[this.currentLevelInSet]);
            this.state = LEVEL_READY;
            if (this.animator) {
                this.animator.clear();
                this.animator.renderViewport(this.gameState.getViewport(), this.gameState);
            }
        }
        this.documentInterface.updateTicks(this.gameState.currentTicks);
        this.documentInterface.updateEngineState(this.state);
    }

    reloadCurrentLevel() {
        this.gameState.reset();
        this.gameState.setLevel(this.levelSet.levels[this.currentLevelInSet]);
        this.state = LEVEL_READY;
        this.documentInterface.updateTicks(this.gameState.currentTicks);
        this.documentInterface.updateEngineState(this.state);
    }

    enqueuePlayerMovement(movement) {
        this.pendingPlayerMovement = movement;
        if (this.state === LEVEL_READY) {
            this.state = LEVEL_ACTIVE;
            this.startTicking();
        }
    }

    tick() {
        // for tests, if we're idle and we tick, then we make ourselves LEVEL_ACTIVE
        if (this.state === IDLE) { this.state = LEVEL_ACTIVE; }
        this.documentInterface.updateTicks(this.gameState.currentTicks);
        if (this.gameState.isOver) {
            this.stopTicking();
            this.state = LEVEL_COMPLETE;
            if (this.gameState.isWin) {
                console.log("win");
                this.documentInterface.showWin();
                this.loadNextLevel();
            } else {
                console.log("lose");
                this.resetCurrentLevel();
            }
        }
        if (this.state === LEVEL_ACTIVE) {
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
            this.documentInterface.updateChipsLeft(this.gameState.chipsLeft);
        }
        this.documentInterface.updateEngineState(this.state);
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
        this.state = PAUSED;
    }

    unpause(shouldStartTicking = false) {
        if (shouldStartTicking) {
            this.startTicking();
        }
        // note: here we assume you can only pause from a level active state.
        // may need to change this later.
        this.state = LEVEL_ACTIVE;
    }

    togglePause(toggleTicking = false) {
        if (this.state === PAUSED) {
            this.unpause(toggleTicking);
        } else {
            this.pause(toggleTicking);
        }
    }

    startTicking() {
        if (this.useIntervals) {
            this.intervalId = setInterval(() => {
                this.tick();
            }, TICK_INTERVAL);
        }
    }

    stopTicking() {
        if (this.useIntervals) {
            clearInterval(this.intervalId);
        }
    }
}

/**
 * Return the singleton instance of the GameEngine, or create one and return it
 * if none already exists.
 * @return {GameEngine} the singleton engine
 */
GameEngine.getInstance = (document, canvas = null, useIntervals = false) => {
    if (SINGLETON_INSTANCE !== null) {
        return SINGLETON_INSTANCE;
    }
    SINGLETON_INSTANCE = new GameEngine(document, canvas, useIntervals);
    return SINGLETON_INSTANCE;
};

GameEngine.reset = (document, canvas = null, useIntervals = false) => {
    SINGLETON_INSTANCE = new GameEngine(document, canvas, useIntervals);
    return SINGLETON_INSTANCE;
};

// if (window) {
//     window.GameEngine = GameEngine;
// }
