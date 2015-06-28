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
        // nothing
        this.spriteMap.set("thin_top", new Coordinate(0, 6));
        this.spriteMap.set("thin_left", new Coordinate(0, 7));
        this.spriteMap.set("thin_bottom", new Coordinate(0, 8));
        this.spriteMap.set("thin_right", new Coordinate(0, 9));
        this.spriteMap.set("block", new Coordinate(0, 10));
        this.spriteMap.set("dirt", new Coordinate(0, 11));
        this.spriteMap.set("ice", new Coordinate(0, 12));
        this.spriteMap.set("force_down", new Coordinate(0, 13));
        // nothing
        // nothing

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
        this.spriteMap.set("gravel", new Coordinate(2, 13));
        this.spriteMap.set("cement", new Coordinate(2, 14));
        this.spriteMap.set("hint", new Coordinate(2, 15));


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
}
