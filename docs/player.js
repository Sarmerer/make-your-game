class Player extends Entity {
  constructor() {
    super();
    this._queue = null;
    this._speed = 3;
    this._div = NewHTMLElement("div", {
      id: "player",
      style: {
        width: `${this._width}px`,
        height: `${this._height}px`,
        position: "absolute",
        zIndex: 999,
      },
    });

    this._animation = new Image(30, 30);
    this._animation.src = "./assets/pacman.png";
    this._div.appendChild(this._animation);
  }

  goUp() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = -this._speed;
    this._xVel = 0;
    this._queue = null;
    this._div.className = "animate walk-up";
  }
  goDown() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = this._speed;
    this._xVel = 0;
    this._queue = null;
    this._div.className = "animate walk-down";
  }
  goLeft() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = -this._speed;
    this._queue = null;
    this._div.className = "animate walk-left";
  }
  goRight() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = this._speed;
    this._queue = null;
    this._div.className = "animate walk-right";
  }

  get div() {
    return this._div;
  }

  get queue() {
    return this._queue;
  }

  set queue(value) {
    this._queue = value;
  }
}
