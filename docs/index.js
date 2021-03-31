let game, player, contoller;

window.onload = function () {
  game = new Game();

  player = game.player;
  controller = new Controller();

  game.draw();

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
  if (controller.up?.active) {
    player.goUp();
  }

  if (controller.down?.active) {
    player.goDown();
  }

  if (controller.left?.active) {
    player.goLeft();
  }

  if (controller.right?.active) {
    player.goRight();
  }

  game.update();

  window.requestAnimationFrame(loop);
}
