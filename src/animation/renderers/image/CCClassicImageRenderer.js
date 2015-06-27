let { ImageRenderer } = require("./ImageRenderer");

export class CCClasicImageRenderer extends ImageRenderer {
    constructor(...args) {
        super(...args);
        this.tilesetFilename = "/images/cc-classic-color-tileset.gif";
        this.tileSideLength = 32; // pixels
        this.tilesetHeight = 16 * this.tileSideLength;
        this.tilesetWidth = 13 * this.tileSideLength;

        this.tilesetImage = this.loadImage(this.tilesetFilename, this.tilesetWidth, this.tilesetHeight);
    }

    renderTile(canvas, tile) {
        if (!this.ready) {
            return false;
        }
        let context = canvas.getContext("2d");
        context.drawImage(
            this.image,
            0, this.tileSideLength, this.tileSideLength, this.tileSideLength,
            0, 0, this.tileSideLength, this.tileSideLength
        );
    }
}
