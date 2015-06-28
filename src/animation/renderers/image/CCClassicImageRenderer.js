let { ImageRenderer } = require("./ImageRenderer");
let { Coordinate } = require("../../../core/2d/Coordinate");

export class CCClassicImageRenderer extends ImageRenderer {
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
