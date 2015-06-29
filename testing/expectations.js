export default function expectations(expect) {
    return {
        expectNoEntityAt: function(state, x, y) {
            expect(state.hasEntityAt(x, y), "found entity at " + x + ", " + y).to.be.false;
        },
        expectEntityAt: function(state, x, y, name) {
            expect(state.hasEntityAt(x, y), "no " + name + " at " + x + ", " + y).to.be.true;
            expect(state.getEntityAt(x, y).name).to.equal(name);
        },
        expectTileAt: function(state, x, y, name) {
            expect(state.hasTileAt(x, y), "no " + name + " at " + x + ", " + y).to.be.true;
            expect(state.getTileAt(x, y).name).to.equal(name);
        },
        expectPlayerAt: function(state, x, y) {
            this.expectEntityAt(state, x, y, "player");
        }
    };
}
