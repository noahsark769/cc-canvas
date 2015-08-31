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
    it("should import correctly", () => {});
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
    it("should not kill player with flippers", () => {
        expectations.withResetLevelStub(() => {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                P player-south-normal
                b boots_water
                ~ water
                ===
                Pb
                .~
            `);
            engine.gameState.movePlayer("RDL");
            expectations.expectNotLoss(engine.gameState);
            expect(engine.gameState.tileMap.get(1, 0).name).to.equal("floor");
        });
    });
    it("should register player as swim state with flippers", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            b boots_water
            ~ water
            ===
            Pb
            ~~
        `);
        engine.gameState.movePlayer("RD");
        expect(engine.gameState.player.state).to.equal("swim");
        engine.gameState.movePlayer("L");
        expect(engine.gameState.player.state).to.equal("swim");
        engine.gameState.movePlayer("U");
        expect(engine.gameState.player.state).to.equal("normal");
    });
    it("should turn into dirt by block", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            W water
            @ block
            ===
            ..W@P
            ..W@.
            ..W@.
            .....
        `);
        engine.gameState.movePlayer("LRDLRDL");
        expectations.expectPlayerAt(engine.gameState, 3, 2);
        expectations.expectTileAt(engine.gameState, 2, 0, "dirt");
        expectations.expectTileAt(engine.gameState, 2, 1, "dirt");
        expectations.expectTileAt(engine.gameState, 2, 2, "dirt");
    });
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
