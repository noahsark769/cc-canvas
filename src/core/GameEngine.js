let {Animator} = require("../animation/Animator");
let {GameState} = require("./GameState");
let {LevelSet} = require("./LevelSet");
let {Direction} = require("./2d/directions");
let {DocumentInterface} = require("../core/DocumentInterface");
let {FileReaderDatParser} = require("../data/FileReaderDatParser");

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
    /**
     * Create a new game engine.
     * @param userIntervals {Boolean} Whether to automatically tick at the set interval
     * once ticking has started.
     */
    constructor(useIntervals = true) {
        this.useIntervals = useIntervals;
        this.state = IDLE;
        this.gameState = new GameState(this); // exactly one gamestate per engine
        this.intervalId = null;

        this.pendingPlayerMovement = null;
        this.playerMovedOnLastTick = false;
        this.playerMovedByInputOnLastTick = false;
        this.ticksSincePlayerMove = 0;

        this.levelSet = null;
        this.currentLevelInSet = 0;

        SINGLETON_INSTANCE = this;
    }

    _resetPlayerMovementOnLastTick() {
        this.playerMovedOnLastTick = false;
        this.playerMovedByInputOnLastTick = false;
    }

    /**
     * Send a message to the document interface.
     * @todo Use an enum here instead of a string.
     */
    interface(message) {
        if (this.documentInterface) {
            switch (message) {
                case "update":
                    this.documentInterface.update(this);
                    break;
                case "win":
                    this.documentInterface.showWin(this);
                    break;
                case "loss":
                    this.documentInterface.showLoss(this);
                    break;
                case "showHint":
                    this.documentInterface.showHint(this.levelSet.levels[this.currentLevelInSet].hint);
                    break;
                case "hideHint":
                    this.documentInterface.hideHint(this.levelSet.levels[this.currentLevelInSet].hint);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Based on the currently playing game, draw a frame. If no animator is set,
     * this method does nothing.
     */
    drawFrame() {
        if (this.animator) {
            this.animator.clear();
            this.animator.renderViewport(this.gameState.viewport, this.gameState);
        }
    }

    /**
     * Load a level set to be played.
     */
    loadLevelSet(levelSet) {
        this.stopTicking();
        this.gameState.reset();

        this.levelSet = levelSet;
        if (this.levelSet.numLevels === 0) {
            console.warn("Trying to input a levelSet with 0 levels");
        }
        this.gameState.setLevel(this.levelSet.levels[0]);
        this.currentLevelInSet = 0;

        this.state = LEVEL_READY;
        this.ticksSincePlayerMove = 0;
        this._resetPlayerMovementOnLastTick();
        this.drawFrame();
        this.interface("update")
        return this; // for testing
    }

    /**
     * Stop play and load the next level, or set a win state if this is the last level.
     */
    loadNextLevel() {
        this.stopTicking();
        if (this.currentLevelInSet + 1 >= this.levelSet.numLevels) {
            this.state = LEVEL_SET_COMPLETE;
        } else {
            this.gameState.reset();
            this.currentLevelInSet++;
            this.gameState.setLevel(this.levelSet.levels[this.currentLevelInSet]);
            this.ticksSincePlayerMove = 0;
            this._resetPlayerMovementOnLastTick();
            this.state = LEVEL_READY;
            this.drawFrame();
        }
        this.interface("update")
    }

    /**
     * Stop play and load the previous level, or do nothing if this is the first level.
     */
    loadPreviousLevel() {
        this.stopTicking();
        if (this.currentLevelInSet - 1 < 0) {
            return;
        }
        this.gameState.reset();
        this.currentLevelInSet--;
        this.gameState.setLevel(this.levelSet.levels[this.currentLevelInSet]);
        this.ticksSincePlayerMove = 0;
        this._resetPlayerMovementOnLastTick();
        this.state = LEVEL_READY;
        this.drawFrame();
        this.interface("update")
    }

    /**
     * Stop play and reset the current level.
     */
    resetCurrentLevel() {
        this.stopTicking();
        this.gameState.reset();
        this.gameState.setLevel(this.levelSet.levels[this.currentLevelInSet]);
        this.ticksSincePlayerMove = 0;
        this._resetPlayerMovementOnLastTick();
        this.state = LEVEL_READY;
        this.drawFrame();
        this.interface("update");
    }

    /**
     * Register that the player would like to move in the given direction.
     * @param movement {String} "left", "right", "down", "up"
     * @todo use Direction instead of strings here
     */
    enqueuePlayerMovement(movement) {
        this.pendingPlayerMovement = movement;
        if (this.state === LEVEL_READY) {
            this.state = LEVEL_ACTIVE;
            this.startTicking();
        }
    }

    /**
     * Advance the game by one tick. Note that there are ten ticks per second.
     * @return {GameEngine} Self, for purposes of engine.tick().tick().tick()
     */
    tick() {
        // for tests, if we're idle and we tick, then we make ourselves LEVEL_ACTIVE
        if (this.state === IDLE || this.state == LEVEL_READY) { this.state = LEVEL_ACTIVE; }
        if (this.gameState.isOver) {
            this.stopTicking();
            this.state = LEVEL_COMPLETE;
            if (this.gameState.isWin) {
                this.interface("win");
                this.loadNextLevel();
            } else {
                this.interface("loss");
                this.resetCurrentLevel();
            }
        }

        if (this.state === LEVEL_ACTIVE) {
            let shouldAdvanceEntities = (this.gameState.even() && this.gameState.currentTicks !== 0);
            this.gameState.advanceEntities(shouldAdvanceEntities);
            this.gameState.toggleWallsIfNeeded();
            if (this.gameState.shouldSlipPlayer()) {
                let pendingMovement = this.pendingPlayerMovement && this.pendingPlayerMovement.charAt(0);
                this.gameState.movePlayerBySlip(pendingMovement, this.playerMovedByInputOnLastTick);
                this.pendingPlayerMovement = null;
                this.playerMovedOnLastTick = true;
                this.playerMovedByInputOnLastTick = false;
                this.ticksSincePlayerMove = 0;
            } else {
                if (this.pendingPlayerMovement === null) {
                    this._resetPlayerMovementOnLastTick();
                    this.ticksSincePlayerMove++;
                    if (this.ticksSincePlayerMove >= 4 && this.gameState.player && !this.gameState.isOver) {
                        this.gameState.player.direction = Direction.south();
                        this.gameState.updatePlayerTile();
                    }
                } else {
                    if (!this.playerMovedOnLastTick && !this.gameState.isOver) {
                        this.gameState.movePlayer(this.pendingPlayerMovement.charAt(0));
                        this.pendingPlayerMovement = null;
                        this.playerMovedOnLastTick = true;
                        this.playerMovedByInputOnLastTick = true;
                        this.ticksSincePlayerMove = 0;
                    } else {
                        this._resetPlayerMovementOnLastTick();
                    }
                }
            }
            this.drawFrame();
            this.gameState.tick();
        }
        this.interface("update");
        return this;
    }

    // for testing purposes only
    step() {
        this.tick();
        this.tick();
        return this;
    }

    /**
     * Pause the game.
     */
    pause() {
        this.stopTicking();
        this.state = PAUSED;
    }

    /**
     * Unpause the game.
     */
    unpause() {
        // todo: here we assume you can only pause from a level active state.
        // may need to change this later.
        this.state = LEVEL_ACTIVE;
    }

    /**
     * Pause the game if it's not pause, unpause if paused.
     */
    togglePause() {
        if (this.state === PAUSED) {
            this.unpause();
        } else {
            this.pause();
        }
    }

    /**
     * Start the game loop. If the engine is configured to tick automatically at
     * intervals, then this will start the automatic ticking. Otherwise, ticks must
     * be done manually by calling tick().
     */
    startTicking() {
        this.ticksSincePlayerMove = 0;
        if (this.useIntervals) {
            this.intervalId = setInterval(() => {
                this.tick();
            }, TICK_INTERVAL);
        }
        this.tick();
    }

    /**
     * Stop automatic ticking.
     */
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
GameEngine.getInstance = (useIntervals = true) => {
    if (SINGLETON_INSTANCE !== null) {
        return SINGLETON_INSTANCE;
    }
    SINGLETON_INSTANCE = new GameEngine(useIntervals);
    return SINGLETON_INSTANCE;
};

/**
 * Reset the game engine to a fresh one and return it.
 */
GameEngine.reset = (useIntervals = true) => {
    SINGLETON_INSTANCE = new GameEngine(useIntervals);
    return SINGLETON_INSTANCE;
};

/**
 * For testing: return the singleton game engine loaded with a level set of one
 * level, consisting of the given schematic.
 * @todo use a schematic object instead of string?
 * @param schematic {String} the test level schematic
 */
GameEngine.fromTestSchematic = (schematic) => {
    let engine = GameEngine.getInstance(false);
    engine.loadLevelSet(LevelSet.fromSchematic(schematic));
    return engine;
};
