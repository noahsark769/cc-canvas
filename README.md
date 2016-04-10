# cc-canvas
Implementation of the game Chip's Challenge in HTML5 canvas.

## Development/installation
1. Clone the repo
2. Change your files
3. To compile, run `grunt build`
4. `python -m SimpleHTTPServer`
5. Go to localhost:8000

Running `grunt` will watch files for changes and build when they change.

This project is build in javascript es6, please use es6 syntax when developing. es6 is compile to es5 with [Babel](https://babeljs.io/.). Running `grunt watch` will compile everything and kick off a new compile when files change, but the compilation step can take a long time, so be wary.

If you add a feature or fix a bug, please add a test for it.

## Tests
To run tests, use `npm test`. This will run mocha with a Babel compile step. To test a specific file, run `scripts/test.rb <name>`, like `scripts/test.rb Block` to run testBlock.js, etc.
