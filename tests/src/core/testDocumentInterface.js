let reqlib = require("app-root-path").require;
let { expect } = require("chai");
let sinon = require("sinon");
let { DocumentInterface } = reqlib("/src/core/DocumentInterface");

describe("DocumentInterface", () => {
    it("should import correctly", () => {});
    it("should use getElementById to find canvas", () => {
        let window = {document: { getElementById: sinon.mock() }};
        let di = new DocumentInterface(window);
        di.getCanvas();
        expect(window.document.getElementById).to.have.been.called;
    });
});
