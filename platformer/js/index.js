let display, game, world, player, contoller;

window.onload = function () {
  display = new Display();
  game = new Game(window.innerHeight, window.innerWidth);
  world = game.world;
  player = world.player;
  controller = new Controller();

  world.draw();

  window.addEventListener("keydown", listenKey);
  window.addEventListener("keyup", listenKey);
  window.requestAnimationFrame(loop); // setInterval(loop, 1000 / 5);
};

function px(n) {
  return `${n}px`;
}

function listenKey(e) {
  controller.onKeyPress(e);
}

function render() {
  player.div.style.top = px(game.world.player.y);
  player.div.style.left = px(game.world.player.x);
}

function loop() {
  resize();

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
  if (display.scaleChanged) {
    display.scaleChanged = false;
    world.rescale(display.xScale, display.yScale);
  }
}
