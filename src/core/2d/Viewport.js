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

    getCenter() {
        let [maxX, minY] = this.ur.asArray();
        let [minX, maxY] = this.ll.asArray();

        return new Coordinate(Math.floor((maxX - minX) / 2) + minX, Math.floor((maxY - minY) / 2) + minY);
    }

    getMaxX() {
        return this.ur.x;
    }
    getMinX() {
        return this.ul.x;
    }
    getMinY() {
        return this.ul.y;
    }
    getMaxY() {
        return this.ll.y;
    }

    shiftTransform(amount, functionName, filter = undefined) {
        for (let i = 0; i < amount; i++) {
            let newCoords = new Map();
            for (let identifier of ["ur", "ul", "ll", "lr"]) {
                newCoords.set(identifier, this[identifier]);
            }
            for (let identifier of ["ur", "ul", "ll", "lr"]) {
                let newCoord = newCoords.get(identifier)[functionName]();
                newCoords.set(identifier, newCoord);
            }
            if (filter && filter(newCoords)) {
                return;
            }
            for (let identifier of ["ur", "ul", "ll", "lr"]) {
                this[identifier] = newCoords.get(identifier);
            }
        }
    }

    shiftUp(amount = 1) { return this.shiftTransform(amount, "upFrom"); }
    shiftDown(amount = 1) { return this.shiftTransform(amount, "downFrom"); }
    shiftLeft(amount = 1) { return this.shiftTransform(amount, "leftFrom"); }
    shiftRight(amount = 1) { return this.shiftTransform(amount, "rightFrom"); }

    shiftUpBounded(amount, bound) {
        return this.shiftTransform(amount, "upFrom", (newCoords) => {
            return newCoords.get("ul").y <= bound;
        });
    }
    shiftDownBounded(amount, bound) {
        return this.shiftTransform(amount, "downFrom", (newCoords) => {
            return newCoords.get("ll").y >= bound;
        });
    }
    shiftLeftBounded(amount, bound) {
        return this.shiftTransform(amount, "leftFrom", (newCoords) => {
            return newCoords.get("ul").x <= bound;
        });
    }
    shiftRightBounded(amount, bound) {
        return this.shiftTransform(amount, "rightFrom", (newCoords) => {
            return newCoords.get("ur").x >= bound;
        });
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

Viewport.constructFromPlayerPosition = function(playerPosition, width, height) {
    let ul, ur, ll, lr;
    if (!playerPosition || (width <= 9 && height <= 9)) {
        return Viewport.constructFromBounds(
            new Coordinate(0, 0),
            new Coordinate(8, 0),
            new Coordinate(8, 8),
            new Coordinate(0, 8)
        );
    }
    let center = playerPosition;
    let viewport = Viewport.constructFromBounds(
        new Coordinate(center.x - 4, center.y - 4),
        new Coordinate(center.x + 4, center.y - 4),
        new Coordinate(center.x + 4, center.y + 4),
        new Coordinate(center.x - 4, center.y + 4)
    );
    while(viewport.getMaxX() > width - 1) {
        viewport.shiftLeft();
    }
    while(viewport.getMaxY() > height - 1) {
        viewport.shiftUp();
    }
    while(viewport.getMinY() < 0) {
        viewport.shiftDown();
    }
    while(viewport.getMinX() < 0) {
        viewport.shiftRight();
    }
    return viewport;
}
