class Engine {
  constructor() {
    this.game = new Game();
    this.controller = new Controller();
  }

  start() {
    window.addEventListener("keydown", this.listenKey);
    window.addEventListener("keyup", this.listenKey);
    window.requestAnimationFrame(this.loop);
  }

  listenKey(e) {
    this.controller.onKeyPress(e);
  }

  render() {
    playerDiv.style.top = px(player.y);
    playerDiv.style.left = px(player.x);
  }

  loop() {
    if (this.controller.up.active) {
      this.game.world.player.jump();
    }

    if (this.controller.left.active) {
      this.game.world.player.goLeft();
    }
    if (this.controller.right.active) {
      this.game.world.player.goRight();
    }

    this.game.update();
    this.render();
    window.requestAnimationFrame(this.loop);
  }
}
