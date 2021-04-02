/**
 * @type {Game}
 */
let game;
/**
 * @type {Player}
 */
let player;
/**
 * @type {Controller
 */
let controller;

const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;

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

function px(n) {
  return `${n}px`;
}

/**
 * @param {String} elementType element type e.g. div, p, img
 * @param {Object} props target element props
 */
function NewHTMLElement(elementType, props) {
  let el = document.createElement(elementType);
  if (!el) return null;
  if (props) Object.assign(el, props);
  if (props?.style) Object.assign(el.style, props.style);
  return el;
}

function listenKey(e) {
  controller.onKeyPress(e);
}

function loop() {
  if (controller.up?.active || player.queue === "up") {
    if (game.playerCanGoUp()) player.goUp();
    else player.queue = "up";
  }

  if (controller.down?.active || player.queue === "down") {
    if (game.playerCanGoDown()) player.goDown();
    else player.queue = "down";
  }

  if (controller.left?.active || player.queue === "left") {
    if (game.playerCanGoLeft()) player.goLeft();
    else player.queue = "left";
  }

  if (controller.right?.active || player.queue === "right") {
    if (game.playerCanGoRight()) player.goRight();
    else player.queue = "right";
  }

  game.update();

  window.requestAnimationFrame(loop);
}
