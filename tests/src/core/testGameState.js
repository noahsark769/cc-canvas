let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Level } = reqlib("/src/core/Level");
let { Direction } = reqlib("/src/core/2d/directions");
let { Viewport } = reqlib("/src/core/2d/Viewport");

let build32x32 = function() {
    let state = new GameState(GameEngine.getInstance(false), Level.buildFromSchematic(`
        . floor
        P player-south-normal
        ===
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................P...............
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
        ................................
    `));
    return state;
}

describe("GameState", () => {
    it("should import correctly", () => {});
    it("should tick correctly", () => {
        let state = build32x32();
        expect(state.currentTicks).to.equal(0);
        state.tick();
        expect(state.currentTicks).to.equal(1);
        state.tick();
        expect(state.currentTicks).to.equal(2);
    });
    it("should support tile state", () => {
        let state = new GameState();
        state.setLevel(Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ...P
            ....
            ....
            ....
        `));
        state.tileMap.setTileByName(1, 1, "wall", 1);

        expect(state.hasTileAt(0, 0), "0, 0").to.be.true;
        expect(state.getTileAt(0, 0).name).to.equal("floor");
        expect(state.hasTileAt(1, 1), "1, 1").to.be.true;
        expect(state.getTileAt(1, 1).name).to.equal("wall");
    });
    it("should know about parity of ticks", () => {
        let state = new GameState();
        expect(state.currentTicks).to.equal(0);
        expect(state.even()).to.be.ok;
        expect(state.odd()).to.not.be.ok;
        state.tick();
        expect(state.even()).to.not.be.ok;
        expect(state.odd()).to.be.ok;
        state.tick();
        expect(state.even()).to.be.ok;
        expect(state.odd()).to.not.be.ok;
    });

    describe("player mechanics", () => {
        it("should support simple player machanics", () => {
            let state = new GameState();
            state.setLevel(Level.buildFromSchematic(`
                . floor
                P player-south-normal
                ===
                ....
                .P..
                ....
                ....
            `));
            state.movePlayer("U");
            let [x, y] = state.getPlayerPosition().asArray();
            expect(x).to.equal(1);
            expect(y).to.equal(0);
            expectations.expectNoEntityAt(state, 1, 1);
            expectations.expectPlayerAt(state, 1, 0);
        });
        it("should not allow the player to move outside of level", () => {
            let state = new GameState();
            state.setLevel(Level.buildFromSchematic(`
                . floor
                P player-south-normal
                ===
                ...
                .P.
                ...
            `));
            state.movePlayer("L");
            state.movePlayer("L");
            expectations.expectNoEntityAt(state, 1, 1);
            expectations.expectPlayerAt(state, 0, 1);
            state.movePlayer("U");
            expectations.expectPlayerAt(state, 0, 0);
            state.movePlayer("U");
            state.movePlayer("L");
            expectations.expectPlayerAt(state, 0, 0);
            state.movePlayer("R");
            state.movePlayer("R");
            state.movePlayer("R");
            expectations.expectPlayerAt(state, 2, 0);
            state.movePlayer("D");
            state.movePlayer("D");
            state.movePlayer("D");
            expectations.expectPlayerAt(state, 2, 2);
        });
    });

    describe("entity interactions", () => {
        it("should not carry tile map over from previous loss", () => {
            let set = new LevelSet();
            let level1 = Level.buildFromSchematic(`
                . floor
                P player-south-normal
                B bug-west
                ===
                .....
                P.B..
                ===
                .....
                .....
                ===
                2 1
            `);
            set.addLevel(level1);
            let engine = GameEngine.getInstance(false);
            engine.loadLevelSet(set);
            engine.resetCurrentLevel();
            expect(engine.gameState.tileMap.get(2, 1).name).to.equal("bug-west")
            let monsters = Array.from(engine.gameState.monsterList.objects());
            expect(monsters.length).to.equal(1);
            expect(monsters[0].direction.equals(Direction.west())).to.be.true;
        });

        it("should register loss when player moves into monster", () => {
            let set = new LevelSet();
            let level1 = Level.buildFromSchematic(`
                . floor
                P player-south-normal
                B bug-west
                ===
                .....
                P.B..
                ===
                .....
                .....
                ===
                2 1
            `);
            set.addLevel(level1);
            let engine = GameEngine.getInstance(false);
            engine.loadLevelSet(set).step();
            engine.tick(); // bug is now next to player, will not move on next tick
            engine.enqueuePlayerMovement("right");
            engine.tick(); // player moves into bug, game should be over
            expect(engine.gameState.isOver).to.be.true;
            expect(engine.gameState.isLoss).to.be.true;
        });

        it("should register loss when monster moves into player", () => {
            let set = new LevelSet();
            let level1 = Level.buildFromSchematic(`
                . floor
                P player-south-normal
                B bug-west
                ===
                .....
                P.B..
                ===
                .....
                .....
                ===
                2 1
            `);
            set.addLevel(level1);
            let engine = GameEngine.getInstance(false);
            engine.loadLevelSet(set).step();
            engine.step();
            engine.tick();
            expect(engine.gameState.isOver).to.be.true;
            expect(engine.gameState.isLoss).to.be.true;
        });
    });

    describe("viewport", () => {
        it("should support getting viewport", () => {
            let state = new GameState(GameEngine.getInstance(false), Level.buildFromSchematic(`
                . floor
                ===
                ....
                ....
                ....
                ....
            `));
            let viewport = state.viewport;
            expect(viewport).to.be.instanceof(Viewport);
        });
        it("should have viewport follow player", () => {
            let state = build32x32();
            // player is at 16, 16. go down down, right right and make sure the viewport
            // is still centered on player
            state.movePlayer("DDRR");
            expect(state.viewport.getCenter().asArray()).to.deep.equals([18, 18]);
        });
        it("should have viewport stop at bounds of level", () => {
            let state = build32x32();
            // move to the corners. Make sure it's centered in the corners as far as it should go
            state.movePlayer("DDRRRRRRRRRRRRRRRR");
            expect(state.viewport.getCenter().asArray()).to.deep.equals([27, 18]);
            expect(state.viewport.getCenter())
            state.movePlayer("DDDDDDDDDDDDDD");
            expect(state.viewport.getCenter().asArray()).to.deep.equals([27, 27]);
            state.movePlayer("UUUUUUUUUUUUUUUUUUUUUUUUUUU");
            expect(state.viewport.getCenter().asArray()).to.deep.equals([27, 4]);
        });
        it("should not let viewport get offset from player location", () => {
            let state = build32x32();
            state.movePlayer("RRRRRRRRRRRRRRRR");
            state.movePlayer("LLLLLLLLLLLLLLLL");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.viewport);
            state.movePlayer("LLLLLLLLLLLLLLLL");
            state.movePlayer("RRRRRRRRRRRRRRRR");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.viewport);
            state.movePlayer("DDDDDDDDDDDDDDDD");
            state.movePlayer("UUUUUUUUUUUUUUUU");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.viewport);
            state.movePlayer("UUUUUUUUUUUUUUUU");
            state.movePlayer("DDDDDDDDDDDDDDDD");
            expectations.expectPlayerAndViewportCenterToMatch(state, state.viewport);
        });
    });
    it("should register game over if there are two chip tiles and the uncontrolled one dies", () => {
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([Level.buildFromSchematic(`
            . floor
            W wall
            B bug-west
            P player-south-normal
            ===
            .WP.
            .W..
            PWB.
            ===
            ....
            ....
            ....
            ===
            2 2
        `)])).step();
        engine.step();
        engine.tick();
        expectations.expectLoss(engine.gameState);
    }); // http://chipschallenge.wikia.com/wiki/Chip
    it.skip("should support non-existance glitch");
    it("should register monster list from level", () => {
        let state = new GameState();
        state.setLevel(Level.buildFromSchematic(`
            . floor
            B bug-west
            P player-south-normal
            ===
            P...
            ..B.
            .BBB
            ===
            ....
            ....
            ....
            ===
            2 1
            2 2
        `));
        let monsters = Array.from(state.monsterList.objects());
        expect(monsters.length).to.equal(2);
        expect(monsters[0].name).to.equal("bug")
    });
    it("should advance monsters in order of monster list", () => {
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([Level.buildFromSchematic(`
            . floor
            B bug-west
            P player-south-normal
            ===
            P...
            ....
            ..BB
            ===
            ....
            ....
            ....
            ===
            2 2
            3 2
        `)])).step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 2, "bug");
        expectations.expectEntityAt(engine.gameState, 2, 2, "bug");

        engine.loadLevelSet(new LevelSet([Level.buildFromSchematic(`
            . floor
            B bug-west
            P player-south-normal
            ===
            P...
            ....
            ..BB
            ===
            ....
            ....
            ....
            ===
            3 2
            2 2
        `)])).step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 3, 1, "bug");
        expectations.expectEntityAt(engine.gameState, 1, 2, "bug");
    });
    it.skip("should remove monster from monster list on death of monster");
    it.skip("should add monster to the monster list when it's cloned");
    it.skip("should add monster to the monster list when cloned even when not on a clone machine"); // http://chipschallenge.wikia.com/wiki/Monster_list
    it("should not add monsters to the monster list if they're on the bottom level", () => {
        let state = new GameState();
        state.setLevel(Level.buildFromSchematic(`
            . floor
            B bug-west
            P player-south-normal
            ===
            P...
            ....
            ....
            ===
            ...B
            ....
            ....
            ===
            3 0
        `));
        let monsters = state.monsterList.asArray();
        expect(monsters.length).to.equal(0);
    }); // http://chipschallenge.wikia.com/wiki/Monster_list
    it("should give player one free move before monsters move", () => {
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(new LevelSet([Level.buildFromSchematic(`
            . floor
            B bug-north
            P player-south-normal
            E escape
            ===
            P...
            B...
            ....
            ===
            ....
            ....
            ....
            ===
            0 1
        `)]));
        let stub = sinon.stub(engine, "resetCurrentLevel");
        engine.enqueuePlayerMovement("right"); // first tick, player moves
        engine.enqueuePlayerMovement("right");
        engine.tick(); // doesn't move on this tick
        engine.tick(); // both move on this tick, bug does not hit player
        expectations.expectEntityAt(engine.gameState, 0, 0, "bug");
        expect(engine.gameState.isOver).to.be.false;
        stub.restore();
    });
});
