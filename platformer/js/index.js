let display, game, world, player, contoller;

window.onload = function () {
  display = new Display();
  display.resize();

  game = new Game(display.width, display.height);
  world = game.world;
  player = world.player;
  controller = new Controller();

  world.draw();

  window.addEventListener("keydown", listenKey);
  window.addEventListener("keyup", listenKey);
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(loop); // setInterval(loop, 1000 / 5);
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

function render() {
  player.div.style.top = px(player.y);
  player.div.style.left = px(player.x);
}

function loop() {
  if (controller.up.active) {
    player.jump();
  }

  if (controller.left.active) {
    player.goLeft();
  }
  if (controller.right.active) {
    player.goRight();
  }

  game.update();
  render();
  window.requestAnimationFrame(this.loop);
}

function resize() {
  display.resize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
    game.world.height / game.world.width
  );

  world.rescale(display.scale);
}
