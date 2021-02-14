let game, contoller;

window.onload = function () {
  game = new Game(window.innerHeight, window.innerWidth);
  controller = new Controller();

  window.addEventListener("keydown", listenKey);
  window.addEventListener("keyup", listenKey);
  window.requestAnimationFrame(loop); // setInterval(loop, 1000 / 60);
};

function px(n) {
  return `${n}px`;
}

function listenKey(e) {
  controller.onKeyPress(e);
}

function render() {
  game.world.player.div.style.top = px(game.world.player.y);
  game.world.player.div.style.left = px(game.world.player.x);
}

function loop() {
  if (controller.up.active) {
    game.world.player.jump();
  }

  if (controller.left.active) {
    game.world.player.goLeft();
  }
  if (controller.right.active) {
    game.world.player.goRight();
  }

  game.update();
  render();
  window.requestAnimationFrame(this.loop);
}
