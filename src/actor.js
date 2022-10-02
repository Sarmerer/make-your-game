import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./constants.js";

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

    this._lastMove = Date.now();
    this._direction = null;

    this._div = null;
  }

  draw() {
    this.div.style.top = `${this.y}px`;
    this.div.style.left = `${this.x}px`;
  }

  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
  }
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
  }

  get xv() {
    return this._xVel;
  }
  set xv(value) {
    this._xVel = value;
  }
  get yv() {
    return this._yVel;
  }
  set yv(value) {
    this._yVel = value;
  }

  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
  }

  get xVirt() {
    return Math.floor(this._x / BLOCK_WIDTH);
  }
  get yVirt() {
    return Math.floor(this._y / BLOCK_WIDTH);
  }

  get div() {
    return this._div;
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
}
