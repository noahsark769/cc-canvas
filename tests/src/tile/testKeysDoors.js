let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { GameEngine } = reqlib("/src/core/GameEngine");
let { Level } = reqlib("/src/core/Level");
let { LevelSet } = reqlib("/src/core/LevelSet");
let { buildLevelFromSchematic } = reqlib("/testing/utils");

let {GreenKey} = reqlib("/src/tile/keys/GreenKey");
let {BlueKey} = reqlib("/src/tile/keys/BlueKey");
let {YellowKey} = reqlib("/src/tile/keys/YellowKey");
let {RedKey} = reqlib("/src/tile/keys/RedKey");

let {GreenDoor} = reqlib("/src/tile/doors/GreenDoor");
let {BlueDoor} = reqlib("/src/tile/doors/BlueDoor");
let {YellowDoor} = reqlib("/src/tile/doors/YellowDoor");
let {RedDoor} = reqlib("/src/tile/doors/RedDoor");

describe("Keys", () => {
    it("should import correctly", () => {});
    it("should be collectable by player", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_yellow
            3 key_red
            4 key_blue
            ===
            P....
            .1234
            ..234
            ...34
            ....4
        `);
        state.movePlayer("DRRRRDLLLDRRRD");
        expect(state.redKeys).to.equal(3);
        expect(state.blueKeys).to.equal(4);
        expect(state.yellowKeys).to.equal(2);
        expect(state.greenKeys).to.equal(1);
    });
    it("should not push away lower layer when collected on top layer by player", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_red
            ===
            P.
            .1
            ===
            ..
            .2
        `);
        state.movePlayer("RDL");
        expect(state.tileMap.get(1, 1, 1).name).to.equal("key_red");
        state.movePlayer("URD");
        expect(state.greenKeys).to.equal(1);
        expect(state.redKeys).to.equal(1);
    });
    it("should not block monsters", () => {
        let set = new LevelSet([Level.buildFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_red
            B bug-west
            ===
            P..
            .1B
            ===
            ...
            ...
            ===
            2 1
        `)]);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        engine.step();
        engine.step();
        expectations.expectEntityAt(engine.gameState, 0, 1, "bug");
    });
    it("should push away lower layer when passed over by monster", () => {
        let set = new LevelSet([Level.buildFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_red
            B bug-west
            ===
            P..
            .1B
            ===
            ...
            .2.
            ===
            2 1
        `)]);
        let engine = GameEngine.getInstance(false);
        engine.loadLevelSet(set);
        engine.step();
        engine.step();
        engine.gameState.movePlayer("RRDLRLR");
        expect(engine.gameState.greenKeys).to.equal(1);
        expect(engine.gameState.redKeys).to.equal(0);
    });
    it("should unlock their respective doors", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_yellow
            3 key_red
            4 key_blue
            B door_blue
            G door_green
            R door_red
            Y door_yellow
            ===
            P1G2Y
            ....3
            ....R
            ....4
            ....B
        `);
        state.movePlayer("RRRRDDDDL");
        expectations.expectPlayerAt(state, 3, 4);
    });
    it("should open the correct number of doors", () => {
        let [state, level] = buildLevelFromSchematic(`
            . floor
            P player-south-normal
            1 key_green
            2 key_yellow
            3 key_red
            4 key_blue
            B door_blue
            G door_green
            R door_red
            Y door_yellow
            ===
            P33RR
            ....R
            .....
            .....
            .....
        `);
        state.movePlayer("RRRRD");
        expectations.expectPlayerAt(state, 4, 0);
    });

    describe("Green Key", () => {
        it("should only be stored once", () => {
            let [state, level] = buildLevelFromSchematic(`
                . floor
                P player-south-normal
                1 key_green
                2 key_yellow
                3 key_red
                4 key_blue
                B door_blue
                G door_green
                R door_red
                Y door_yellow
                ===
                P1111
                .....
                .....
                .....
                .....
            `);
            state.movePlayer("RRRR");
            expect(state.greenKeys).to.equal(1);
        });
        it("should not be used up opening a door", () => {
            let [state, level] = buildLevelFromSchematic(`
                . floor
                P player-south-normal
                1 key_green
                2 key_yellow
                3 key_red
                4 key_blue
                B door_blue
                G door_green
                R door_red
                Y door_yellow
                ===
                P1GGG
                .....
                .....
                .....
                .....
            `);
            state.movePlayer("RRRRD");
            expectations.expectPlayerAt(state, 4, 1);
        });
    });
});
