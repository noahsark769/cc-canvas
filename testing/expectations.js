let reqlib = require("app-root-path").require;
let sinon = require("sinon");
let {Coordinate} = reqlib("/src/core/2d/Coordinate");
let {GameEngine} = reqlib("/src/core/GameEngine");

export default function expectations(expect) {
    return {
        withResetLevelStub: function(fn) {
            let stub = sinon.stub(GameEngine.getInstance(), "resetCurrentLevel");
            fn();
            stub.restore();
        },
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
            expect(found, "no " + name + " found at " + x + ", " + y + ", monster list was: " + state.monsterList.asArray().map((entity) => { return entity.position.toString(); }).join(", ")).to.be.true;
        },
        expectTileAt: function(state, x, y, name) {
            expect(state.hasTileAt(x, y), "no " + name + " at " + x + ", " + y).to.be.true;
            expect(state.getTileAt(x, y).name).to.equal(name);
        },
        expectPlayerAt: function(state, x, y) {
            expect(state.hasPlayerAt(x, y), "no player at " + x + ", " + y + ", instead was at " + state.getPlayerPosition().serialize()).to.be.true;
        },
        movePlayerAndExpectAt: function(gameState, controlString, x, y, name) {
            gameState.movePlayer(controlString);
            this.expectPlayerAt(gameState, x, y);
        },
        expectPlayerAndViewportCenterToMatch: function(state, viewport) {
            expect(state.getPlayerPosition().asArray()).to.deep.equals(viewport.getCenter().asArray());
        },
        expectLoss: function(state) {
            expect(state.isOver, "state was not game over").to.be.true;
            expect(state.isLoss, "state was not a loss").to.be.true;
            expect(state.isWin, "state was a win").to.be.false;
        },
        expectNotLoss: function(state) {
            expect(state.isOver, "state was game over").to.be.false;
            expect(state.isLoss, "state was a loss").to.be.false;
        },
        expectWin: function(state) {
            expect(state.isOver, "state was not game over").to.be.true;
            expect(state.isWin, "state was not a win").to.be.true;
            expect(state.isLoss, "state was a loss").to.be.false;
        },
        expectEntityAtCoordSequence: function(engine, entity, startCoord, sequence) {
            let coord = startCoord;
            this.expectEntityAt(engine.gameState, coord.x, coord.y, entity);

            for (let char of sequence) {
                coord = coord[char]();
                engine.step();
                this.expectEntityAt(engine.gameState, coord.x, coord.y, entity);
            }
        },
        expectTileToBlockBlocks: function(tilename) {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                @ block
                B ${tilename}
                P player-south-normal
                ===
                P...B.
                ...@B.
                ....B.
                ....B.
            `);
            engine.gameState.movePlayer("RRDRRRRRURDLDRRRURDLDRRR");
            this.expectPlayerAt(engine.gameState, 2, 3);
            this.expectTileAt(engine.gameState, 3, 3, "block");
            this.expectTileAt(engine.gameState, 4, 2, tilename);
        },
        expectTileToBlockPlayer: function(tilename) {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                B ${tilename}
                P player-south-normal
                ===
                P...B.
            `);
            engine.gameState.movePlayer("RRRRRRRRRRRR");
            this.expectPlayerAt(engine.gameState, 3, 0);
            this.expectTileAt(engine.gameState, 4, 0, tilename);
        },
        expectTileNotToBlockPlayer: function(tilename) {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                B ${tilename}
                P player-south-normal
                ===
                P...B.
            `);
            engine.gameState.movePlayer("RRRRRRRRRRRR");
            this.expectPlayerAt(engine.gameState, 5, 0);
            this.expectTileAt(engine.gameState, 4, 0, tilename);
        },
        expectTileToBlockMonsters: function(tilename) {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                @ ${tilename}
                P player-south-normal
                B bug-west
                p paramecium-west
                F fireball-west
                G glider-west
                O ball-west
                w walker-west
                b blob-west
                T teeth-west
                W wall
                ===
                P...@BW
                WWWWWWW
                ....@pW
                WWWWWWW
                ....@FW
                WWWWWWW
                ....@GW
                WWWWWWW
                ....@OW
                WWWWWWW
                ....@wW
                WWWWWWW
                ....@bW
                WWWWWWW
                ....@TW
                WWWWWWW
                ===
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                ===
                5 0
                5 2
                5 4
                5 6
                5 8
                5 10
                5 12
                5 14
            `).step().step().step().step().step().step().step().step().step().step().step().step();
            this.expectEntityAt(engine.gameState, 5, 0, "bug");
            this.expectEntityAt(engine.gameState, 5, 2, "paramecium");
            this.expectEntityAt(engine.gameState, 5, 4, "fireball");
            this.expectEntityAt(engine.gameState, 5, 6, "glider");
            this.expectEntityAt(engine.gameState, 5, 8, "ball");
            this.expectEntityAt(engine.gameState, 5, 10, "walker");
            this.expectEntityAt(engine.gameState, 5, 12, "blob");
            this.expectEntityAt(engine.gameState, 5, 14, "teeth");
        },
        expectTileNotToBlockMonsters: function(tilename) {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                @ ${tilename}
                P player-south-normal
                B bug-west
                p paramecium-west
                F fireball-west
                G glider-west
                O ball-west
                w walker-west
                b blob-west
                T teeth-west
                W wall
                g gravel
                ===
                P...@BW
                WWWWWWW
                ....@pW
                WWWWWWW
                ....@FW
                WWWWWWW
                ....@GW
                WWWWWWW
                ....@OW
                WWWWWWW
                ....@wW
                WWWWWWW
                ....@bW
                WWWWWWW
                ....@TW
                WWWWWWW
                ===
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .......
                .....g.
                .......
                .......
                .......
                ===
                5 0
                5 2
                5 4
                5 6
                5 8
                5 10
                5 12
                5 14
            `);
            this.withResetLevelStub(() => {
                engine.step().step().step().step();
                this.expectTileAt(engine.gameState, 5, 0, "floor");
                this.expectTileAt(engine.gameState, 5, 2, "floor");
                this.expectTileAt(engine.gameState, 5, 4, "floor");
                this.expectTileAt(engine.gameState, 5, 6, "floor");
                this.expectTileAt(engine.gameState, 5, 8, "floor");
                this.expectTileAt(engine.gameState, 5, 10, "floor");
                this.expectTileAt(engine.gameState, 5, 12, "gravel");
                this.expectTileAt(engine.gameState, 5, 14, "floor");
            });
        }
    };
}
