require("babelify/polyfill");

let { GameEngine } = require("core/GameEngine");
let { Wall } = require("core/tile/Wall");

let engine = new GameEngine();
let animator = engine.getAnimator();

animator.renderTile(new Wall());
