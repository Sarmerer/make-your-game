import { Game } from "./game.js";
import { Controller } from "./controller/index.js";
import { Player } from "./player.js";

/**
 * @type {Game}
 */
let game, world;
/**
 * @type {Player}
 */
let player;
/**
 * @type {Controller}
 */
let controller;

window.onload = function () {
  game = new Game();
  world = game.world;

  player = game.player;
  controller = new Controller();

  game.start();

  window.addEventListener("keydown", listenKey);
  window.addEventListener("keyup", listenKey);
  window.requestAnimationFrame(loop);
};

function listenKey(e) {
  controller.onKeyPress(e);
}

function loop() {
  const dirs = ["up", "down", "left", "right"];

  for (let dir of dirs) {
    if (controller.isKeyDown(dir)) {
      if (game.playerCanGo(dir)) {
        player.go(dir);
        controller.clearQueue();
      } else {
        controller.setQueue(dir);
      }
    }
  }

  game.update();

  window.requestAnimationFrame(loop);
}
