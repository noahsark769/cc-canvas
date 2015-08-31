let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Boots", () => {
    it("should register in game state when picked up", () => {
        let engine = GameEngine.fromTestSchematic(`
            P player-south-normal
            . floor
            1 boots_water
            2 boots_fire
            3 boots_ice
            4 boots_force
            ===
            p.1234
        `);
        expect(engine.gameState.boots.water).to.be.false;
        expect(engine.gameState.boots.fire).to.be.false;
        expect(engine.gameState.boots.ice).to.be.false;
        expect(engine.gameState.boots.force).to.be.false;
        engine.gameState.movePlayer("RR");
        expect(engine.gameState.boots.water).to.be.true;
        engine.gameState.movePlayer("R");
        expect(engine.gameState.boots.water).to.be.true;
        expect(engine.gameState.boots.fire).to.be.true;
        engine.gameState.movePlayer("R");
        expect(engine.gameState.boots.water).to.be.true;
        expect(engine.gameState.boots.fire).to.be.true;
        expect(engine.gameState.boots.ice).to.be.true;
        engine.gameState.movePlayer("R");
        expect(engine.gameState.boots.water).to.be.true;
        expect(engine.gameState.boots.fire).to.be.true;
        expect(engine.gameState.boots.ice).to.be.true;
        expect(engine.gameState.boots.force).to.be.true;
    })
});
