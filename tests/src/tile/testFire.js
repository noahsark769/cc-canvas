let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { Wall } = reqlib("/src/tile/Wall");
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

describe("Fire", () => {
    it("should import correctly", () => {});
    it("should be deadly to player", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            x fire
            ===
            P.
            .x
        `);
        engine.gameState.movePlayer("RD");
        expectations.expectLoss(engine.gameState);
        expect(engine.gameState.tileMap.get(1, 1).name).to.equal("player-dead-fire");
    });
    it("should not kill player with fire boots", () => {
        expectations.withResetLevelStub(() => {
            let engine = GameEngine.fromTestSchematic(`
                . floor
                P player-south-normal
                b boots_fire
                x fire
                ===
                Pb
                .x
            `);
            engine.gameState.movePlayer("RDL");
            expectations.expectNotLoss(engine.gameState);
            expect(engine.gameState.tileMap.get(1, 0).name).to.equal("floor");
        });
    });
    it("should kill all monsters except fireball (excluding walkers and bugs)", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            x fire
            P player-south-normal
            p paramecium-west
            F fireball-west
            G glider-west
            O ball-west
            b blob-west
            T teeth-west
            W wall
            ===
            P.x..pW
            WWWWWWW
            ..x..FW
            WWWWWWW
            ..x..GW
            WWWWWWW
            ..x..OW
            WWWWWWW
            ....xbW
            WWWWWWW
            ..x..TW
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
            ===
            5 0
            5 2
            5 4
            5 6
            5 8
            5 10
        `).step().step().step().step().step().step().step();
        expect(
            engine.gameState.monsterList.length,
            "monster list was actually: " + engine.gameState.monsterList.asArray().map((entity) => { return entity.position.toString() + " " + entity.name; }).join(", ")
        ).to.equal(1);
        expectations.expectEntityAt(engine.gameState, 1, 2, "fireball");
    });
    it(": walkers and bugs should treat fire as walls", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B bug-north
            w walker-north
            x fire
            ===
            Px.x.
            xxx.x
            .....
            xBxwx
            ===
            .....
            .....
            .....
            .....
            ===
            1 3
            3 3
        `).step();
        expectations.expectEntityAt(engine.gameState, 1, 3, "bug");
        expectations.expectEntityAt(engine.gameState, 3, 3, "walker");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 2, "bug");
        expectations.expectEntityAt(engine.gameState, 3, 2, "walker");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 0, 2, "bug");
        expectations.expectEntityAt(engine.gameState, 3, 1, "walker");
        engine.step();
        expectations.expectEntityAt(engine.gameState, 1, 2, "bug");
        expectations.expectEntityAt(engine.gameState, 3, 2, "walker");
    });
    it.skip("should kill tanks");
    it("should not destroy blocks when moved on", () => {
        let engine = GameEngine.fromTestSchematic(`
            . floor
            P player-south-normal
            B block
            x fire
            ===
            PBx.
        `);
        engine.gameState.movePlayer("R");
        expectations.expectTileAt(engine.gameState, 2, 0, "block");
    });
});
