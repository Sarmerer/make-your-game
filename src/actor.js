import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./settings.js";
import { GameObject } from "./game-object.js";
import { Direction } from "./direction.js";

export class Actor extends GameObject {
  constructor(x = 0, y = 0, width = BLOCK_WIDTH, height = BLOCK_HEIGHT) {
    super();

    this.x_ = x;
    this.y_ = y;
    this.xVel = 0;
    this.yVel = 0;

    this.lastMoved = Date.now();
    this.direction = new Direction();

    this.width = width;
    this.height = height;
  }

  draw() {
    this.el.style.top = `${this.y}px`;
    this.el.style.left = `${this.x}px`;

    this.draw_();
  }

  getAvailableDirections_(world) {
    const x = this.xVirt;
    const y = this.yVirt;
    const tilesAround = [
      { x: x - 1, y, dir: Direction.LEFT },
      { x: x + 1, y, dir: Direction.RIGHT },
      { x, y: y - 1, dir: Direction.UP },
      { x, y: y + 1, dir: Direction.DOWN },
    ];

    return tilesAround.reduce((acc, ta) => {
      const tile = world.getTile(ta.x, ta.y);
      if (tile && !this.blockedBy.includes(tile.type)) {
        acc.push(new Direction(ta.dir));
      }

      return acc;
    }, []);
  }

  getAvailableDirections(world) {
    return this.getAvailableDirections_(world);
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
    if (this.direction.isRight()) return Math.floor(rvx);
    else if (this.direction.isLeft()) return Math.ceil(rvx);
    this.x_ = Math.round(rvx) * BLOCK_WIDTH;
    return Math.round(rvx);
  }
  get yVirt() {
    const rvy = this.y_ / BLOCK_HEIGHT;
    if (this.direction.isDown()) return Math.floor(rvy);
    else if (this.direction.isUp()) return Math.ceil(rvy);
    this.y_ = Math.round(rvy) * BLOCK_HEIGHT;
    return Math.round(rvy);
  }

  get blockedBy() {
    return [];
  }
}
