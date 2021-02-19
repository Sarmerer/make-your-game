class Player {
  /**
   * @param {Number} x - player initial x posiation
   * @param {Number} y - player initial y posiation
   * @param {Number} height - player height
   * @param {Number} width - player width
   */
  constructor(x = 0, y = 0, height = 15, width = 15) {
    this.x = x;
    this.y = y;
    this.xv = 0;
    this.yv = 0;
    this.jumping = false;
    this.width = width;
    this.height = height;

    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = px(this.width);
    div.style.height = px(this.height);
    div.style.background = "white";
    div.style.top = window.innerHeight - this.height;
    div.style.left = window.innerWidth - this.width;

    this.div = div;
    document.body.append(this.div);
  }

  update() {
    this.x += this.xv;
    this.y += this.yv;
  }

  goLeft() {
    this.xv -= 0.5;
  }
  goRight() {
    this.xv += 0.5;
  }
  jump() {
    if (this.jumping) return;
    this.jumping = true;
    this.yv -= 20;
  }

  /**
   * @returns {Number} hotizontal center point of a player
   */
  get cx() {
    return this.x + this.width / 2;
  }
  /**
   * @returns {Number} vertical center point of a player
   */
  get cy() {
    return this.y + this.height / 2;
  }

  get bottom() {
    return this.y + this.height;
  }
  get top() {
    return this.y;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
