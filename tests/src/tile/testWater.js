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
    it.skip("should import correctly");
    it.skip("should be deadly to player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-normal-south
            ~ water
            ===
            P.
            .~
        `);
        engine.gameState.movePlayer("RD");
        expecations.expectLoss(engine.gameState);
        expect(engine.gameState.tileMap.get(1, 1).name).to.equal("player-dead-water");
    });
    it.skip("should not kill player with flippers");
    it.skip("should register player as swim state with flippers");
    it.skip("should turn into dirt by block");
    it.skip("should kill all monsters except glider", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-normal-south
            ~ water
            B bug-west
            P paramecium-west
            F fireball-west
            G glider-west
            O ball-west
            w walker-west
            b blob-west
            T teeth-west
            ===
            P.~..BW
            WWWWWWW
            ..~..PW
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
        `).step().step().step().step().step().step();
        expect(
            engine.gameState.monsterList.length,
            "monster list was actually: " + engine.gameState.monsterList.asArray().map((entity) => { return entity.position.toString(); }).join(", ")
        ).to.equal(1);
        expectations.expectEntityAt(engine.gameState, 0, 6, "glider")
    });
    it.skip("should be deadly to tanks");
});
