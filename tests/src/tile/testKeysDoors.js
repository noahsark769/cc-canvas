let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let expectations = reqlib("/testing/expectations")(expect);
let { GameState } = reqlib("/src/core/GameState");
let { LevelBuilder } = reqlib("/src/util/LevelBuilder");

let {GreenKey} = reqlib("/src/tile/keys/GreenKey");
let {BlueKey} = reqlib("/src/tile/keys/BlueKey");
let {YellowKey} = reqlib("/src/tile/keys/YellowKey");
let {RedKey} = reqlib("/src/tile/keys/RedKey");

let {GreenDoor} = reqlib("/src/tile/doors/GreenDoor");
let {BlueDoor} = reqlib("/src/tile/doors/BlueDoor");
let {YellowDoor} = reqlib("/src/tile/doors/YellowDoor");
let {RedDoor} = reqlib("/src/tile/doors/RedDoor");

function buildLevelFromSchematic(schematic) {
    let state = new GameState();
    let builder = LevelBuilder.buildFromSchematic(schematic);
    let level = builder.generateLevel();
    state.setLevel(level);
    return [state, level];
}

describe("Keys", () => {
    it("should import correctly", () => {});
    it("should be collectable by player", () => {
        let [state, level] = buildLevelFromSchematic(`
            . tile floor
            P entity player
            1 tile key_green
            2 tile key_yellow
            3 tile key_red
            4 tile key_blue
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
    it("should unlock their respective doors", () => {
        let [state, level] = buildLevelFromSchematic(`
            . tile floor
            P entity player
            1 tile key_green
            2 tile key_yellow
            3 tile key_red
            4 tile key_blue
            B tile door_blue
            G tile door_green
            R tile door_red
            Y tile door_yellow
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
            . tile floor
            P entity player
            1 tile key_green
            2 tile key_yellow
            3 tile key_red
            4 tile key_blue
            B tile door_blue
            G tile door_green
            R tile door_red
            Y tile door_yellow
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
                . tile floor
                P entity player
                1 tile key_green
                2 tile key_yellow
                3 tile key_red
                4 tile key_blue
                B tile door_blue
                G tile door_green
                R tile door_red
                Y tile door_yellow
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
                . tile floor
                P entity player
                1 tile key_green
                2 tile key_yellow
                3 tile key_red
                4 tile key_blue
                B tile door_blue
                G tile door_green
                R tile door_red
                Y tile door_yellow
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
