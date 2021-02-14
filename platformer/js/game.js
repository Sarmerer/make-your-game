class Game {
  /**
   * @param {Number} height - world height
   * @param {Number} width - world - width
   */
  constructor(height = 0, width = 0) {
    this.world = {
      height: height,
      width: width,
      gravity: 1.5,
      friction: 0.9,

      player: new Player(0, 0, 20, 20),
      map: [],

      collides: function (player) {
        if (player.y > this.height - player.height) {
          player.jumping = false;
          player.y = this.height - player.height;
          player.yv = 0;
        } else if (player.y < 0) {
          player.y = 0;
          player.yv = 0;
        }
        if (this.player.x < 0) {
          this.player.x = 0;
          this.player.xv = 0;
        } else if (this.player.x > this.width - this.player.width) {
          this.player.x = this.width - this.player.width;
          this.player.xv = 0;
        }
      },
      update: function () {
        this.player.yv += this.gravity;
        this.player.update();
        this.player.xv *= this.friction;
        this.collides(this.player);
      },
    };
  }
  update() {
    this.world.update();
  }
}
