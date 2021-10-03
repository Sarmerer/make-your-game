import { Controller } from "./controller/index.js";
import { DIRECTIONS, directionToString } from "./config.js";
import { Player } from "./player.js";
import { Game } from "./game.js";

/**
 * @type {Game}
 */
let game;

/**
 * @type {Controller}
 */
let controller;

window.onload = function () {
  game = new Game();
  game.init();

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
  const player = game._player;
  const dirs = Object.values(DIRECTIONS);

  for (let dir of dirs) {
    const dirStr = directionToString(dir);
    if (!controller.isKeyDown(dirStr)) continue;

    if (game.playerCanGo(dir)) player.go(dir);
    else controller.setQueue(dirStr);
  }

  game.update();

  window.requestAnimationFrame(loop);
}
