Game.Collider = class {
  /**
   * @param {Number} x - x coordinate of a collider
   * @param {Number} y - y coordinate of a collider
   * @param {Number} width - collidr width
   * @param {Number} height - collider height
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.initialWidth = width;
    this.initialHeight = height;
  }

  detectCollision() {}

  /**
   * @returns {Number} horizontal center of a collider
   */
  get cx() {
    return this.x + this.width / 2;
  }
  /**
   * @returns {Number} vertical center of a collider
   */
  get cy() {
    return this.y + this.height / 2;
  }

  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
};

/**
 * @classdesc basic inner rect collider, it detects, whether an object inside it collides with it's edges
 */
Game.Collider.RectInner = class extends Game.Collider {
  detectCollision(player) {
    if (player.bottom > this.height) {
      player.jumping = false;
      player.y = this.height - player.height;
      player.yv = 0;
    } else if (player.top < 0) {
      player.y = 0;
      player.yv = 0;
    }

    if (player.left < 0) {
      player.x = 0;
      player.xv = 0;
    } else if (player.right > this.width) {
      player.x = this.width - player.width;
      player.xv = 0;
    }
  }
};

/**
 * @classdesc basic outer rect collider, it detects, whether an object collides with it fron outside
 */
Game.Collider.RectOuter = class extends Game.Collider {
  detectCollision(player) {
    let cdx = player.cx - this.cx;
    let cdy = player.cy - this.cy;
    let aw = (player.width + this.width) * 0.5;
    let ah = (player.height + this.height) * 0.5;

    if (Math.abs(cdx) > aw || Math.abs(cdy) > ah) return;

    if (Math.abs(cdx / this.width) > Math.abs(cdy / this.height)) {
      if (cdx < 0) {
        player.x = this.x - player.width;
        player.xv = 0;
      } else {
        player.x = this.right;
        player.xv = 0;
      }
    } else {
      if (cdy < 0) {
        player.y = this.y - player.height;
        player.yv = 0;
        player.jumping = false;
      } else {
        player.y = this.bottom;
        player.yv = 0;
      }
    }
  }
};
