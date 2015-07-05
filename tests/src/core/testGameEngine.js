let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameEngine, LEVEL_READY, LEVEL_ACTIVE } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Level } = reqlib("/src/core/Level");
let { Direction } = reqlib("/src/core/2d/directions");
let { getMockDocument, getMockCanvas } = reqlib("/testing/utils");

describe("GameEngine", () => {
    beforeEach(() => {
        GameEngine.reset(false);
    });
    it("should be available via import", () => {});
    it("should work with appRootPath imports and chai", () => {
        expect(1).to.equal(1);
    });
    it("should be singleton", () => {
        let engine1 = GameEngine.getInstance();
        engine1.someProperty = true;
        let engine2 = GameEngine.getInstance();
        expect(engine2.someProperty).to.be.true;
    });
    it("should tick correctly", () => {
        let engine = GameEngine.getInstance();
        expect(engine.gameState.currentTicks).to.equal(0);
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(1);
    });
    it("should pause correctly", () => {
        let engine = GameEngine.getInstance();
        engine.tick();
        engine.pause();
        expect(engine.gameState.currentTicks).to.equal(1);
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(1);
        engine.unpause();
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(2);

        engine.togglePause(); // now paused
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(2);
        engine.togglePause();
        engine.tick();
        expect(engine.gameState.currentTicks).to.equal(3);
    });
    it("should map two ticks to one step", () => {
        let engine = GameEngine.getInstance();
        expect(engine.gameState.currentTicks).to.equal(0);
        engine.step();
        expect(engine.gameState.currentTicks).to.equal(2);
    });
    it("should only move player at steps", () => {
        let engine = GameEngine.getInstance();
        let level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ....P....
        `);
        engine.loadLevelSet(new LevelSet([level]));
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        // first tick, player will move immediately
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        // second tick, player will not move, only moves on even ticks
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        // third tick, player will now move
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 2, 0);
    });
    it("should support player waiting [1/2]", () => {
        let engine = GameEngine.getInstance(getMockDocument(), getMockCanvas());
        let level = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ....P....
        `);
        engine.loadLevelSet(new LevelSet([level]));
        engine.tick();
        engine.enqueuePlayerMovement("left");
        // since the player was not moving before, it should move now.
        engine.tick();
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        engine.enqueuePlayerMovement("left");
        engine.tick();
        // just moved, so should not have moved again
        expectations.expectPlayerAt(engine.gameState, 3, 0);
        engine.tick();
        // now should have moved again
        expectations.expectPlayerAt(engine.gameState, 2, 0);
    });
    it("should support level sets and loading next levels", () => {
        let set = new LevelSet();
        let level1 = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ...P.
            .....
        `);
        level1.name = "level1";
        let level2 = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ..P..
            .....
        `);
        level2.name = "level2";
        set.addLevel(level1);
        set.addLevel(level2);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        // should autoload first level
        expect(engine.gameState.level.name).to.equal("level1");
        engine.loadNextLevel();
        expect(engine.gameState.level.name).to.equal("level2");
    });
    it("should be active after receiving command", () => {
        let set = LevelSet.fromLevel(Level.buildFromSchematic(`
            . floor
            P player-south-normal
            ===
            ...P.
            .....
        `));
        let engine = GameEngine.getInstance(getMockDocument(), getMockCanvas());
        engine.loadLevelSet(set);
        expect(engine.state).to.equal(LEVEL_READY);
        engine.enqueuePlayerMovement("down");
        expect(engine.state).to.equal(LEVEL_ACTIVE);
    });
    it.skip("should move onto the next level after escape", () => {
        let set = new LevelSet();
        let level1 = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            E escape
            ===
            ...P.
            ....E
        `);
        level1.name = "level1";
        let level2 = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            E escape
            ===
            ..P..
            ....E
        `);
        level2.name = "level2";
        set.addLevel(level1);
        set.addLevel(level2);
        let engine = GameEngine.getInstance(getMockDocument(), getMockCanvas());
        engine.loadLevelSet(set);
        engine.tick(); // get it started
        engine.gameState.movePlayer("DR");
    });
    it("should load original entities from level after reload", () => {
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
        expect(engine.gameState.tileMap.get(2, 1).name).to.equal("bug-west");
    });
    it("should load entity directions from the original level after reset", () => {
        let set = new LevelSet();
        let level1 = Level.buildFromSchematic(`
            . floor
            P player-south-normal
            B bug-west
            ===
            ..P..
            ..B..
            ===
            .....
            .....
            ===
            2 1
        `);
        set.addLevel(level1);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        engine.step();
        engine.step();
        engine.step();
        engine.step();
        // now the bug should have changed its direction to east
        // instead of west. we want to make sure it's still facing west
        engine.resetCurrentLevel();
        let monsters = Array.from(engine.gameState.monsterList.objects());
        expect(monsters.length).to.equal(1);
        expect(monsters[0].direction.equals(Direction.west())).to.be.true;
    });
});
