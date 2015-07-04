let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let expectations = reqlib("/testing/expectations")(expect);
let { GameEngine, LEVEL_READY, LEVEL_ACTIVE } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");
let { getMockDocument, getMockCanvas } = reqlib("/testing/utils");
let { buildSimpleLevelWithPlayerAt } = reqlib("/testing/utils");

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
        let [state, level] = buildSimpleLevelWithPlayerAt(32, 32, "floor", 16, 16, engine.gameState);
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        // first tick, player will move immediately
        engine.tick();
        expectations.expectPlayerAt(state, 16, 17);
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        // second tick, player will not move, only moves on even ticks
        engine.tick();
        expectations.expectPlayerAt(state, 16, 17);
        // third tick, player will now move
        engine.tick();
        expectations.expectPlayerAt(state, 16, 18);
    });
    it("should support player moving in odd step", () => {
        let engine = GameEngine.getInstance(getMockDocument(), getMockCanvas());
        let [state, level] = buildSimpleLevelWithPlayerAt(32, 32, "floor", 16, 16, engine.gameState);
        engine.tick();
        engine.enqueuePlayerMovement("down");
        // since the player was not moving before, it should move now.
        engine.tick();
        expectations.expectPlayerAt(state, 16, 17);
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        engine.enqueuePlayerMovement("down");
        engine.tick();
        // just moved, so should not have moved again
        expectations.expectPlayerAt(state, 16, 17);
        engine.tick();
        // now should have moved again
        expectations.expectPlayerAt(state, 16, 18);
    });
    it("should support level sets and loading next levels", () => {
        let set = new LevelSet();
        let level1 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            ===
            ...P.
            .....
        `);
        level1.name = "level1";
        let level2 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
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
        let set = LevelSet.fromLevel(LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
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
        let level1 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            E tile escape
            ===
            ...P.
            ....E
        `);
        level1.name = "level1";
        let level2 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            E tile escape
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
    it("should load original entity maps from level after reload", () => {
        let set = new LevelSet();
        let level1 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            B entity bug-normal-west
            ===
            .....
            P.B..
        `);
        level1.name = "level1";
        set.addLevel(level1);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        engine.resetCurrentLevel();
        expect(engine.gameState.entityMap.get(0, 1).name).to.equal("player")
        expect(engine.gameState.entityMap.get(2, 1).name).to.equal("bug")
    });
    it("should load entity directions from the original level after reset", () => {
        let set = new LevelSet();
        let level1 = LevelBuilder.generateFromSchematic(`
            . tile floor
            P entity player
            B entity bug-normal-west
            ===
            ..P..
            ..B..
        `);
        level1.name = "level1";
        set.addLevel(level1);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        engine.step();
        engine.step();
        engine.step();
        engine.step();
        engine.step();
        // now the bug has killed the player but it should have also changed its direction to east
        // instead of west. we want to make sure it's still facing west
        engine.resetCurrentLevel();
        expect(engine.gameState.entityMap.get(2, 1).name).to.equal("bug");
        expect(engine.gameState.entityMap.get(2, 1).direction.toString()).to.equal("west");
    });
});
