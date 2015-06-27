let { expect } = require("chai");

describe("inner module", () => {
    it("should be detected by the testing framework", () => {
        expect(1).to.equal(1);
    })
})
