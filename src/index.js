require("babelify/polyfill");

let { GameEngine } = require("core/GameEngine");
let { Wall } = require("core/tile/Wall");

var engine = new GameEngine();
var animator = engine.getAnimator();

animator.renderTile(new Wall());
