let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Water", () => {
    it("should import correctly");
    it("should be deadly to player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            ~ water
            ===
            P.
            .~
        `);
        engine.gameState.movePlayer("RD");
        expectations.expectLoss(engine.gameState);
        expect(engine.gameState.tileMap.get(1, 1).name).to.equal("player-dead-water");
    });
    it.skip("should not kill player with flippers");
    it.skip("should register player as swim state with flippers");
    it.skip("should turn into dirt by block");
    it("should kill all monsters except glider", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            ~ water
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
            P.~..BW
            WWWWWWW
            ..~..pW
            WWWWWWW
            ..~..FW
            WWWWWWW
            ..~..GW
            WWWWWWW
            ..~..OW
            WWWWWWW
            ..~..wW
            WWWWWWW
            ....~bW
            WWWWWWW
            ..~..TW
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
        `).step().step().step().step().step().step().step();
        expect(
            engine.gameState.monsterList.length,
            "monster list was actually: " + engine.gameState.monsterList.asArray().map((entity) => { return entity.position.toString() + " " + entity.name; }).join(", ")
        ).to.equal(1);
        expectations.expectEntityAt(engine.gameState, 1, 6, "glider");
    });
    it.skip("should be deadly to tanks");
});
