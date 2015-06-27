let sinon = require("sinon");

/**
 * Return a sinon spy representing the intrface of the DOM document
 * object, for all the purposes we need it for. Useful for testing the
 * DocumentInterface object.
 */
export function getMockDocument() {
    return {
        getElementById: sinon.spy()
    };
}
