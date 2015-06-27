export class ImageRenderer {
    constructor(Image, imageLoadedCallback) {
        this.Image = Image;
        this.imageLoadedCallback = imageLoadedCallback;
        this.ready = false;
    }
    renderTile(canvas, tile) {

    }
    renderEntity(canvas, entity) {

    }
    renderEntityOnTile(canvas, enitity, tile) {

    }

    loadImage(filename, width, height) {
        this.image = new Image(width, height);
        this.image.onload = () => {
            this.imageLoaded();
        }
        this.image.src = filename; // will trigger image load
    }

    imageLoaded() {
        this.ready = true;
        if (this.imageLoadedCallback) {
            this.imageLoadedCallback(this);
        }

    }
};
