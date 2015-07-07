let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let { Entity } = reqlib("/src/entity/Entity");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { Direction } = reqlib("/src/core/2d/directions");

describe("Entity", () => {
    it("should import correctly", () => {});
    it("should register directional tile directly after movement", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            B bug-north
            ===
            B.
            .P
            ===
            ..
            ..
            ===
            0 0
        `));
        engine.enqueuePlayerMovement("left");
        expect(engine.gameState.tileMap.get(0, 1, 1).name).to.equal("player-west-normal");
        engine.step();
        expect(engine.gameState.tileMap.get(1, 0, 1).name).to.equal("bug-east");
    });

    it("should reset player to south after 4 ticks", () => {
        let engine = GameEngine.getInstance(false).loadLevelSet(LevelSet.fromSchematic(`
            . floor
            P player-south-normal
            ===
            ..
            .P
        `));
        engine.enqueuePlayerMovement("left"); // one tick
        engine.tick(); // once since last tick
        engine.tick(); // twice since last tick
        engine.tick(); // three times since last tick
        engine.tick(); // four times since last tick, should now be facing down
        expect(engine.gameState.player.direction.equals(Direction.south())).to.be.true;
        expect(engine.gameState.tileMap.get(0, 1, 1).name).to.equal("player-south-normal");
    });
    it.skip("should make monsters die in water even when chip is in it");
    it.skip(": monsters should block blocks");
});
