import { Controller } from "./controller/index.js";
import { Game } from "./game.js";
import { events, settings, toggleSetting } from "./settings.js";
import { Direction } from "./direction.js";
import { Player } from "./player.js";

/** @type {Game} */
let game;

/** @type {Controller} */
let controller;

/** @type {Player} */
let player;

window.onload = function () {
  game = new Game();
  game.create_();

  player = game.getObjectByTag("player");
  controller = new Controller();

  window.addEventListener("keydown", listenKey);
  window.addEventListener("keyup", listenKey);

  controller.on(events.konamiCode, () => {
    alert("You found the konami code!");
  });

  controller.on(events.toggleDebugMode, () => {
    toggleSetting("debugMode");
    game.toggleDebugMode();
  });

  controller.on(events.suicide, () => {
    game.restart();
  });

  controller.on(events.rollMe, () => {
    window.open("https://youtu.be/dQw4w9WgXcQ", "_blank").focus();
  });

  controller.on(events.toggleOnePunchMode, () => {
    alert("One Punch Mode is not implemented yet!");
  });

  controller.on(events.toggleGodMode, () => {
    alert("God Mode is not implemented yet!");
  });

  controller.on(events.iddqd, () => {
    alert("I'd rather not.");
  });

  controller.on(events.heal, () => {
    // game.heal();
  });

  controller.on(events.toggleNoChase, () => {
    // game.toggleNoChase();
  });

  start();
};

function listenKey(e) {
  controller.onKeyPress(e);
}

function start() {
  game.start();
  window.requestAnimationFrame(loop);
}

function pause() {
  toggleSetting("gamePaused");
}

function resume() {
  toggleSetting("gamePaused");
  start();
}

const directions = [
  Direction.Up(),
  Direction.Right(),
  Direction.Down(),
  Direction.Left(),
];

function loop() {
  for (let dir of directions) {
    const dirStr = dir.toString();
    if (!controller.isKeyDown(dirStr)) continue;

    if (dir.isAvailableWithin(player.getAvailableDirections(game.world))) {
      player.direction.change(dir);
    } else {
      controller.setQueue(dirStr);
    }
  }

  game.update();
  game.draw();

  if (!settings.gamePaused) window.requestAnimationFrame(loop);
}
