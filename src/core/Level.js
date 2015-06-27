export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileMap = new Map();
        this.entityMap = new Map();
    }
}
