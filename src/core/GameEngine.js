let {Animator} = require("../animation/Animator");
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
let TICK_INTERVAL = 300;


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
    constructor(document) {
        this.documentInterface = new DocumentInterface(document);
        this.animator = new Animator(this.documentInterface.getCanvas());
        SINGLETON_INSTANCE = this;
    }
}

/**
 * Return the singleton instance of the GameEngine, or create one and return it
 * if none already exists.
 * @return {GameEngine} the singleton engine
 */
GameEngine.getInstance = (document) => {
    if (SINGLETON_INSTANCE !== null) {
        return SINGLETON_INSTANCE;
    }
    SINGLETON_INSTANCE = new GameEngine(document);
    return SINGLETON_INSTANCE;
};
