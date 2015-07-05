let reqlib = require("app-root-path").require;
let sinon = require("sinon");
let {Coordinate} = reqlib("/src/core/2d/Coordinate");

export default function expectations(expect) {
    return {
        expectNoEntityAt: function(state, x, y) {
            let found = false;
            let name;
            for (let entity of state.monsterList.objects()) {
                if (entity.position.equals(new Coordinate(x, y)) && entity.name === name) {
                    found = true;
                    name = entity.name;
                }
            }
            expect(found, "an unexpected entity was found, and it was " + name).to.be.false;
        },
        expectEntityAt: function(state, x, y, name) {
            let found = false;
            for (let entity of state.monsterList.objects()) {
                if (entity.position.equals(new Coordinate(x, y)) && entity.name === name) {
                    found = true;
                }
            }
            expect(found, "no " + name + " found at " + x + ", " + y).to.be.true;
        },
        expectTileAt: function(state, x, y, name) {
            expect(state.hasTileAt(x, y), "no " + name + " at " + x + ", " + y).to.be.true;
            expect(state.getTileAt(x, y).name).to.equal(name);
        },
        expectPlayerAt: function(state, x, y) {
            expect(state.hasPlayerAt(x, y), "no player at " + x + ", " + y + ", instead was at " + state.getPlayerPosition().serialize()).to.be.true;
        },
        expectPlayerAndViewportCenterToMatch: function(state, viewport) {
            expect(state.getPlayerPosition().asArray()).to.deep.equals(viewport.getCenter().asArray());
        },
        expectLoss: function(state) {
            expect(state.isOver, "state was not game over").to.be.true;
            expect(state.isLoss, "state was not a loss").to.be.true;
            expect(state.isWin, "state was a win").to.be.false;
        }
    };
}
