import {
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  DIRECTIONS,
  directionToString,
} from "./constants.js";
import { GameObject } from "./game-object.js";

export class Actor extends GameObject {
  constructor(x = 0, y = 0, width = BLOCK_WIDTH, height = BLOCK_HEIGHT) {
    super();

    this.x_ = x;
    this.y_ = y;
    this.xVel = 0;
    this.yVel = 0;

    this.lastMoved = Date.now();
    this.direction = null;

    this.width = width;
    this.height = height;

    this.create_();
  }

  update() {
    this.el.style.top = `${this.y}px`;
    this.el.style.left = `${this.x}px`;

    if (this.direction != null) {
      this.el.className = this.el.className
        .split(" ")
        .filter((c) => !c.startsWith("walk-"))
        .join(" ");
      this.el.classList.add(`walk-${directionToString(this.direction)}`);
    }
  }

  get x() {
    return this.x_;
  }

  set x(value) {
    this.x_ = Math.round(value);
  }

  get y() {
    return this.y_;
  }

  set y(value) {
    this.y_ = Math.round(value);
  }

  get xVirt() {
    const rvx = this.x_ / BLOCK_WIDTH;
    if (this.direction == DIRECTIONS.RIGHT) return Math.floor(rvx);
    else if (this.direction == DIRECTIONS.LEFT) return Math.ceil(rvx);
    this.x_ = Math.round(rvx) * BLOCK_WIDTH;
    return Math.round(rvx);
  }
  get yVirt() {
    const rvy = this.y_ / BLOCK_HEIGHT;
    if (this.direction == DIRECTIONS.DOWN) return Math.floor(rvy);
    else if (this.direction == DIRECTIONS.UP) return Math.ceil(rvy);
    this.y_ = Math.round(rvy) * BLOCK_HEIGHT;
    return Math.round(rvy);
  }
}
