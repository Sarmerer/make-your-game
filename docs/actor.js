import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./config.js";

export class Actor {
  constructor(
    x = BLOCK_WIDTH,
    y = BLOCK_WIDTH,
    width = BLOCK_WIDTH,
    height = BLOCK_HEIGHT
  ) {
    this._x = x;
    this._y = y;
    this._xVel = 0;
    this._yVel = 0;
    this._width = width;
    this._height = height;

    this._div = null;
  }

  draw() {
    this.div.style.top = `${this.y}px`;
    this.div.style.left = `${this.x}px`;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get xv() {
    return this._xVel;
  }
  get yv() {
    return this._yVel;
  }
  get top() {
    return this._x;
  }
  get right() {
    return this._y + this._width;
  }
  get bottom() {
    return this._x + this._height;
  }
  get left() {
    return this._y;
  }
  get xVirt() {
    return this._xVel > 0
      ? Math.floor(this._x / BLOCK_WIDTH)
      : Math.ceil(this._x / BLOCK_WIDTH);
  }
  get yVirt() {
    return this._yVel > 0
      ? Math.floor(this._y / BLOCK_HEIGHT)
      : Math.ceil(this._y / BLOCK_HEIGHT);
  }

  get div() {
    return this._div;
  }

  set x(value) {
    this._x = value;
  }
  set y(value) {
    this._y = value;
  }
  set xv(value) {
    this._xVel = value;
  }
  set yv(value) {
    this._yVel = value;
  }
}
