export default function expectations(expect) {
    return {
        expectNoEntityAt: function(state, x, y) {
            expect(state.hasEntityAt(x, y), "found entity at " + x + ", " + y).to.be.false;
        },
        expectEntityAt: function(state, x, y, name) {
            expect(state.getEntityAt(x, y), "no " + name + " at " + x + ", " + y).to.be.ok;
            expect(state.getEntityAt(x, y).name).to.equal(name);
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
        }
    };
}
