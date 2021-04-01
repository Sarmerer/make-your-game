let game, player, contoller;

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
  if (el && props) Object.assign(el, props);
  if (el.style && props.style) Object.assign(el.style, props.style);
  return el;
}

function listenKey(e) {
  controller.onKeyPress(e);
}

function loop() {
  if (controller.up?.active || player.queue === "up") {
    player.queue = "up";
    if (
      player.virtualY - 1 > 0 &&
      !world.map[player.virtualY - 1][player.virtualX]
    )
      player.goUp();
  }

  if (controller.down?.active || player.queue === "down") {
    player.queue = "down";
    if (
      player.virtualY + 1 > 0 &&
      !world.map[player.virtualY + 1][player.virtualX]
    )
      player.goDown();
  }

  if (controller.left?.active || player.queue === "left") {
    player.queue = "left";
    if (
      player.virtualX - 1 > 0 &&
      !world.map[player.virtualY][player.virtualX - 1]
    )
      player.goLeft();
  }

  if (controller.right?.active || player.queue === "right") {
    player.queue = "right";

    if (
      player.virtualX + 1 < world.width &&
      !world.map[player.virtualY][player.virtualX + 1]
    )
      player.goRight();
  }

  game.update();

  window.requestAnimationFrame(loop);
}
