let { Coordinate } = require("./Coordinate");

export class Viewport {
    constructor() {
        this.ul = null;
        this.ur = null;
        this.ll = null;
        this.lr = null;
    }

    *coordinatesInBounds() {
        let [maxX, minY] = this.ur.asArray();
        let [minX, maxY] = this.ll.asArray();

        for (let j = minY; j <= maxY; j++) {
            for (let i = minX; i <= maxX; i++) {
                yield new Coordinate(i, j);
            }
        }
    }
}

Viewport.constructFromBounds = function(ul, ur, lr, ll) {
    let viewport = new Viewport();
    viewport.ul = ul;
    viewport.ur = ur;
    viewport.ll = ll;
    viewport.lr = lr;
    return viewport;
};

Viewport.constructFromSideLength = function(ul, sideLength) {
    return Viewport.constructFromBounds(
        ul,
        new Coordinate(ul.x + sideLength - 1, ul.y),
        new Coordinate(ul.x + sideLength - 1, ul.y + sideLength - 1),
        new Coordinate(ul.x, ul.y + sideLength - 1)
    );
};
