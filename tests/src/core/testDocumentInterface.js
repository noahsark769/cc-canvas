let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { DocumentInterface } = reqlib("/src/core/DocumentInterface");

describe("DocumentInterface", () => {
    it("should import correctly", () => {});
    it("should use getElementById to find canvas", () => {
        let document = { getElementById: sinon.mock() };
        let di = new DocumentInterface(document);
        di.getCanvas();
        expect(document.getElementById).to.have.been.called;
    });
});
