export class GameEngine {

}

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
GameEngine.TICK_INTERVAL = 300;
