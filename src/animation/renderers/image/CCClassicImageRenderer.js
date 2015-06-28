let { ImageRenderer } = require("./ImageRenderer");
let { Coordinate } = require("../../../core/2d/Coordinate");

/**
 * CCClassicImageRenderer represents a renderer for the game engine that renders
 * tiles and entities with the graphics from the Chip's Challenge game distributed
 * with Windows.
 *
 * Basically, it knows about a spritesheet that contains all the tiles used for the
 * Windows graphics, and it knows how to render a certain portion of that spritesheet
 * when asked to render a certain tile at a certain coordinate. Pretty cool actually.
 */
export class CCClassicImageRenderer extends ImageRenderer {
    /**
     * Initialize the classic renderer with the tilesetFilename, and establish things
     * about it like the length of the tiles. Then load the image and build the sprite
     * map (see below).
     */
    constructor(...args) {
        super(...args);
        this.tilesetFilename = "/images/cc-classic-color-tileset.gif";
        this.tileSideLength = 32; // pixels
        this.tilesetHeight = 16 * this.tileSideLength;
        this.tilesetWidth = 13 * this.tileSideLength;

        this.tilesetImage = this.loadImage(this.tilesetFilename, this.tilesetWidth, this.tilesetHeight);
        this.spriteMap = null;
        this.buildSpriteMap();
    }

    /**
     * Construct a mapping of tile type => spritesheet coordinate and save it in
     * this.spriteMap. Note that the spritesheet coordinate here means the TILE
     * coordinate, not the pixel coordinate. The spritesheet is organized into tiles,
     * so we reference them exactly like we do coordinates in the actual game engine levels:
     * (0, 0) is top left, x grows right and y grows down.
     *
     * Note that these names correspond exactly to the "name" proprerty of the Tile object
     * (and its subclasses).
     */
    buildSpriteMap() {
        if (this.spriteMap !== null) { return; }
        this.spriteMap = new Map();

        this.spriteMap.set("floor", new Coordinate(0, 0));
        this.spriteMap.set("wall", new Coordinate(0, 1));
        this.spriteMap.set("chip", new Coordinate(0, 2));
        this.spriteMap.set("water", new Coordinate(0, 3));
        this.spriteMap.set("fire", new Coordinate(0, 4));
        this.spriteMap.set("NONE", new Coordinate(0, 5));
        this.spriteMap.set("thin_top", new Coordinate(0, 6));
        this.spriteMap.set("thin_left", new Coordinate(0, 7));
        this.spriteMap.set("thin_bottom", new Coordinate(0, 8));
        this.spriteMap.set("thin_right", new Coordinate(0, 9));
        this.spriteMap.set("block", new Coordinate(0, 10));
        this.spriteMap.set("dirt", new Coordinate(0, 11));
        this.spriteMap.set("ice", new Coordinate(0, 12));
        this.spriteMap.set("force_down", new Coordinate(0, 13));
        this.spriteMap.set("NONE", new Coordinate(0, 14));
        this.spriteMap.set("NONE", new Coordinate(0, 15));

        // nothing
        // nothing
        this.spriteMap.set("force_up", new Coordinate(1, 2));
        this.spriteMap.set("force_right", new Coordinate(1, 3));
        this.spriteMap.set("force_left", new Coordinate(1, 4));
        this.spriteMap.set("escape", new Coordinate(1, 5));
        this.spriteMap.set("door_blue", new Coordinate(1, 6));
        this.spriteMap.set("door_red", new Coordinate(1, 7));
        this.spriteMap.set("door_green", new Coordinate(1, 8));
        this.spriteMap.set("door_yellow", new Coordinate(1, 9));
        this.spriteMap.set("ice_ul", new Coordinate(1, 10));
        this.spriteMap.set("ice_ur", new Coordinate(1, 11));
        this.spriteMap.set("ice_lr", new Coordinate(1, 12));
        this.spriteMap.set("ice_ll", new Coordinate(1, 13));
        this.spriteMap.set("block_mystery_fake", new Coordinate(1, 14));
        this.spriteMap.set("block_mystery_real", new Coordinate(1, 15));

        // nothing
        this.spriteMap.set("spy", new Coordinate(2, 1));
        this.spriteMap.set("socket", new Coordinate(2, 2));
        this.spriteMap.set("button_green", new Coordinate(2, 3));
        this.spriteMap.set("button_red", new Coordinate(2, 4));
        this.spriteMap.set("toggle_closed", new Coordinate(2, 5));
        this.spriteMap.set("toggle_open", new Coordinate(2, 6));
        this.spriteMap.set("button_brown", new Coordinate(2, 7));
        this.spriteMap.set("button_blue", new Coordinate(2, 8));
        this.spriteMap.set("teleport", new Coordinate(2, 9));
        this.spriteMap.set("bomb", new Coordinate(2, 10));
        this.spriteMap.set("bear_trap", new Coordinate(2, 11));
        // nothing
        this.spriteMap.set("gravel", new Coordinate(3, 13));
        this.spriteMap.set("cement", new Coordinate(3, 14));
        this.spriteMap.set("hint", new Coordinate(3, 15));

        this.spriteMap.set("thin_lr", new Coordinate(3, 0));
        this.spriteMap.set("clone_machine", new Coordinate(3, 1));
        this.spriteMap.set("force_random", new Coordinate(3, 2));
        this.spriteMap.set("player-dead-water", new Coordinate(3, 3));
        this.spriteMap.set("player-dead-fire", new Coordinate(3, 4));
        this.spriteMap.set("player-dead-charred", new Coordinate(3, 5));
        this.spriteMap.set("NONE", new Coordinate(3, 6));
        this.spriteMap.set("NONE", new Coordinate(3, 7));
        this.spriteMap.set("NONE", new Coordinate(3, 8));
        this.spriteMap.set("player-normal-win", new Coordinate(3, 9));
        this.spriteMap.set("escape-inverted", new Coordinate(3, 10));
        this.spriteMap.set("escape-normal", new Coordinate(3, 11));
        this.spriteMap.set("player-swim-north", new Coordinate(3, 12));
        this.spriteMap.set("player-swim-west", new Coordinate(3, 13));
        this.spriteMap.set("player-swim-down", new Coordinate(3, 14));
        this.spriteMap.set("player-swim-east", new Coordinate(3, 15));

        this.spriteMap.set("bug-normal-north", new Coordinate(4, 0));
        this.spriteMap.set("bug-normal-west", new Coordinate(4, 1));
        this.spriteMap.set("bug-normal-south", new Coordinate(4, 2));
        this.spriteMap.set("bug-normal-east", new Coordinate(4, 3));
        this.spriteMap.set("fireball-normal-north", new Coordinate(4, 4));
        this.spriteMap.set("fireball-normal-west", new Coordinate(4, 5));
        this.spriteMap.set("fireball-normal-south", new Coordinate(4, 6));
        this.spriteMap.set("fireball-normal-east", new Coordinate(4, 7));
        this.spriteMap.set("ball-normal-north", new Coordinate(4, 8));
        this.spriteMap.set("ball-normal-west", new Coordinate(4, 9));
        this.spriteMap.set("ball-normal-south", new Coordinate(4, 10));
        this.spriteMap.set("ball-normal-east", new Coordinate(4, 11));
        this.spriteMap.set("tank-normal-north", new Coordinate(4, 12));
        this.spriteMap.set("tank-normal-west", new Coordinate(4, 13));
        this.spriteMap.set("tank-normal-south", new Coordinate(4, 14));
        this.spriteMap.set("tank-normal-east", new Coordinate(4, 15));

        this.spriteMap.set("glider-normal-north", new Coordinate(5, 0));
        this.spriteMap.set("glider-normal-west", new Coordinate(5, 1));
        this.spriteMap.set("glider-normal-south", new Coordinate(5, 2));
        this.spriteMap.set("glider-normal-east", new Coordinate(5, 3));
        this.spriteMap.set("teeth-normal-north", new Coordinate(5, 4));
        this.spriteMap.set("teeth-normal-west", new Coordinate(5, 5));
        this.spriteMap.set("teeth-normal-south", new Coordinate(5, 6));
        this.spriteMap.set("teeth-normal-east", new Coordinate(5, 7));
        this.spriteMap.set("walker-normal-north", new Coordinate(5, 8));
        this.spriteMap.set("walker-normal-west", new Coordinate(5, 9));
        this.spriteMap.set("walker-normal-south", new Coordinate(5, 10));
        this.spriteMap.set("walker-normal-east", new Coordinate(5, 11));
        this.spriteMap.set("blob-normal-north", new Coordinate(5, 12));
        this.spriteMap.set("blob-normal-west", new Coordinate(5, 13));
        this.spriteMap.set("blob-normal-south", new Coordinate(5, 14));
        this.spriteMap.set("blob-normal-east", new Coordinate(5, 15));

        this.spriteMap.set("paramecium-normal-north", new Coordinate(6, 0));
        this.spriteMap.set("paramecium-normal-west", new Coordinate(6, 1));
        this.spriteMap.set("paramecium-normal-south", new Coordinate(6, 2));
        this.spriteMap.set("paramecium-normal-east", new Coordinate(6, 3));
        this.spriteMap.set("key_blue-normal", new Coordinate(6, 4));
        this.spriteMap.set("key_red-normal", new Coordinate(6, 5));
        this.spriteMap.set("key_green-normal", new Coordinate(6, 6));
        this.spriteMap.set("key_yellow-normal", new Coordinate(6, 7));
        this.spriteMap.set("boots_water-normal", new Coordinate(6, 8));
        this.spriteMap.set("boots_fire-normal", new Coordinate(6, 9));
        this.spriteMap.set("boots_ice-normal", new Coordinate(6, 10));
        this.spriteMap.set("boots_force-normal", new Coordinate(6, 11));
        this.spriteMap.set("player-normal-north", new Coordinate(6, 12));
        this.spriteMap.set("player-normal-west", new Coordinate(6, 13));
        this.spriteMap.set("player-normal-south", new Coordinate(6, 14));
        this.spriteMap.set("player-normal-east", new Coordinate(6, 15));

        // blank backgrounds
        this.spriteMap.set("bug-blank-north", new Coordinate(7, 0));
        this.spriteMap.set("bug-blank-west", new Coordinate(7, 1));
        this.spriteMap.set("bug-blank-south", new Coordinate(7, 2));
        this.spriteMap.set("bug-blank-east", new Coordinate(7, 3));
        this.spriteMap.set("fireball-blank-north", new Coordinate(7, 4));
        this.spriteMap.set("fireball-blank-west", new Coordinate(7, 5));
        this.spriteMap.set("fireball-blank-south", new Coordinate(7, 6));
        this.spriteMap.set("fireball-blank-east", new Coordinate(7, 7));
        this.spriteMap.set("ball-blank-north", new Coordinate(7, 8));
        this.spriteMap.set("ball-blank-west", new Coordinate(7, 9));
        this.spriteMap.set("ball-blank-south", new Coordinate(7, 10));
        this.spriteMap.set("ball-blank-east", new Coordinate(7, 11));
        this.spriteMap.set("tank-blank-north", new Coordinate(7, 12));
        this.spriteMap.set("tank-blank-west", new Coordinate(7, 13));
        this.spriteMap.set("tank-blank-south", new Coordinate(7, 14));
        this.spriteMap.set("tank-blank-east", new Coordinate(7, 15));

        this.spriteMap.set("glider-blank-north", new Coordinate(8, 0));
        this.spriteMap.set("glider-blank-west", new Coordinate(8, 1));
        this.spriteMap.set("glider-blank-south", new Coordinate(8, 2));
        this.spriteMap.set("glider-blank-east", new Coordinate(8, 3));
        this.spriteMap.set("teeth-blank-north", new Coordinate(8, 4));
        this.spriteMap.set("teeth-blank-west", new Coordinate(8, 5));
        this.spriteMap.set("teeth-blank-south", new Coordinate(8, 6));
        this.spriteMap.set("teeth-blank-east", new Coordinate(8, 7));
        this.spriteMap.set("walker-blank-north", new Coordinate(8, 8));
        this.spriteMap.set("walker-blank-west", new Coordinate(8, 9));
        this.spriteMap.set("walker-blank-south", new Coordinate(8, 10));
        this.spriteMap.set("walker-blank-east", new Coordinate(8, 11));
        this.spriteMap.set("blob-blank-north", new Coordinate(8, 12));
        this.spriteMap.set("blob-blank-west", new Coordinate(8, 13));
        this.spriteMap.set("blob-blank-south", new Coordinate(8, 14));
        this.spriteMap.set("blob-blank-east", new Coordinate(8, 15));

        this.spriteMap.set("paramecium-blank-north", new Coordinate(9, 0));
        this.spriteMap.set("paramecium-blank-west", new Coordinate(9, 1));
        this.spriteMap.set("paramecium-blank-south", new Coordinate(9, 2));
        this.spriteMap.set("paramecium-blank-east", new Coordinate(9, 3));
        this.spriteMap.set("key_blue-blank", new Coordinate(9, 4));
        this.spriteMap.set("key_red-blank", new Coordinate(9, 5));
        this.spriteMap.set("key_green-blank", new Coordinate(9, 6));
        this.spriteMap.set("key_yellow-blank", new Coordinate(9, 7));
        this.spriteMap.set("boots_water-blank", new Coordinate(9, 8));
        this.spriteMap.set("boots_fire-blank", new Coordinate(9, 9));
        this.spriteMap.set("boots_ice-blank", new Coordinate(9, 10));
        this.spriteMap.set("boots_force-blank", new Coordinate(9, 11));
        this.spriteMap.set("player-blank-north", new Coordinate(9, 12));
        this.spriteMap.set("player-blank-west", new Coordinate(9, 13));
        this.spriteMap.set("player-blank-south", new Coordinate(9, 14));
        this.spriteMap.set("player-blank-east", new Coordinate(9, 15));

        // masks
        this.spriteMap.set("bug-mask-north", new Coordinate(10, 0));
        this.spriteMap.set("bug-mask-west", new Coordinate(10, 1));
        this.spriteMap.set("bug-mask-south", new Coordinate(10, 2));
        this.spriteMap.set("bug-mask-east", new Coordinate(10, 3));
        this.spriteMap.set("fireball-mask-north", new Coordinate(10, 4));
        this.spriteMap.set("fireball-mask-west", new Coordinate(10, 5));
        this.spriteMap.set("fireball-mask-south", new Coordinate(10, 6));
        this.spriteMap.set("fireball-mask-east", new Coordinate(10, 7));
        this.spriteMap.set("ball-mask-north", new Coordinate(10, 8));
        this.spriteMap.set("ball-mask-west", new Coordinate(10, 9));
        this.spriteMap.set("ball-mask-south", new Coordinate(10, 10));
        this.spriteMap.set("ball-mask-east", new Coordinate(10, 11));
        this.spriteMap.set("tank-mask-north", new Coordinate(10, 12));
        this.spriteMap.set("tank-mask-west", new Coordinate(10, 13));
        this.spriteMap.set("tank-mask-south", new Coordinate(10, 14));
        this.spriteMap.set("tank-mask-east", new Coordinate(10, 15));

        this.spriteMap.set("glider-mask-north", new Coordinate(11, 0));
        this.spriteMap.set("glider-mask-west", new Coordinate(11, 1));
        this.spriteMap.set("glider-mask-south", new Coordinate(11, 2));
        this.spriteMap.set("glider-mask-east", new Coordinate(11, 3));
        this.spriteMap.set("teeth-mask-north", new Coordinate(11, 4));
        this.spriteMap.set("teeth-mask-west", new Coordinate(11, 5));
        this.spriteMap.set("teeth-mask-south", new Coordinate(11, 6));
        this.spriteMap.set("teeth-mask-east", new Coordinate(11, 7));
        this.spriteMap.set("walker-mask-north", new Coordinate(11, 8));
        this.spriteMap.set("walker-mask-west", new Coordinate(11, 9));
        this.spriteMap.set("walker-mask-south", new Coordinate(11, 10));
        this.spriteMap.set("walker-mask-east", new Coordinate(11, 11));
        this.spriteMap.set("blob-mask-north", new Coordinate(11, 12));
        this.spriteMap.set("blob-mask-west", new Coordinate(11, 13));
        this.spriteMap.set("blob-mask-south", new Coordinate(11, 14));
        this.spriteMap.set("blob-mask-east", new Coordinate(11, 15));

        this.spriteMap.set("paramecium-mask-north", new Coordinate(12, 0));
        this.spriteMap.set("paramecium-mask-west", new Coordinate(12, 1));
        this.spriteMap.set("paramecium-mask-south", new Coordinate(12, 2));
        this.spriteMap.set("paramecium-mask-east", new Coordinate(12, 3));
        this.spriteMap.set("key_blue-mask", new Coordinate(12, 4));
        this.spriteMap.set("key_red-mask", new Coordinate(12, 5));
        this.spriteMap.set("key_green-mask", new Coordinate(12, 6));
        this.spriteMap.set("key_yellow-mask", new Coordinate(12, 7));
        this.spriteMap.set("boots_water-mask", new Coordinate(12, 8));
        this.spriteMap.set("boots_fire-mask", new Coordinate(12, 9));
        this.spriteMap.set("boots_ice-mask", new Coordinate(12, 10));
        this.spriteMap.set("boots_force-mask", new Coordinate(12, 11));
        this.spriteMap.set("player-mask-north", new Coordinate(12, 12));
        this.spriteMap.set("player-mask-west", new Coordinate(12, 13));
        this.spriteMap.set("player-mask-south", new Coordinate(12, 14));
        this.spriteMap.set("player-mask-east", new Coordinate(12, 15));
    }

    /**
     * Render a given tile on the given canvas at the given level coordinate.
     * @param {Element} the canvas element to use
     * @param {Tile} the tile to render
     * @param {Coordinte} the canvas coordinate to render at. Note that this
     *     Coordinate value may not represent the actual Coordinate that the
     *     tile exists at in the level, but here we only care about where on
     *     the actual canvas we have to render it.
     */
    renderTile(canvas, tile, coordinate) {
        if (!this.ready) {
            return false;
        }
        this.buildSpriteMap();
        let sprite = this.spriteMap.get(tile.name);
        let context = canvas.getContext("2d");
        context.drawImage(
            this.image,

            // from sprite map
            sprite.x * this.tileSideLength,
            sprite.y * this.tileSideLength,
            this.tileSideLength,
            this.tileSideLength,

            // destination (canvas)
            coordinate.x * this.tileSideLength,
            coordinate.y * this.tileSideLength,
            this.tileSideLength,
            this.tileSideLength
        );
    }

    renderEntity(canvas, entity, coordinate) {
        if (!this.ready) {
            return false;
        }
        this.buildSpriteMap();
        let sprite = this.spriteMap.get(entity.name + "-" + entity.state + "-" + entity.direction);
        let context = canvas.getContext("2d");
        context.drawImage(
            this.image,

            // from sprite map
            sprite.x * this.tileSideLength,
            sprite.y * this.tileSideLength,
            this.tileSideLength,
            this.tileSideLength,

            // destination (canvas)
            coordinate.x * this.tileSideLength,
            coordinate.y * this.tileSideLength,
            this.tileSideLength,
            this.tileSideLength
        );
    }
}
