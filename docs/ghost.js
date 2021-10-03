import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";
import { BLOCK_HEIGHT, BLOCK_WIDTH, DIRECTIONS, ghostSpeed } from "./config.js";

export class Ghost extends Actor {
  constructor(x = 90, y = 90, id = "ghost") {
    super(x, y);
    this._id = id;
    this._speed = ghostSpeed;
    this._direction = null;
    this._div = NewHTMLElement("div", {
      id: id,
      style: {
        width: `${this._width}px`,
        height: `${this._height}px`,
        position: "absolute",
        zIndex: 999,
      },
    });

    this._targetTile = null;

    this._animation = new Image(30, 30);
    this._animation.src = "./assets/pacman.png";
    this._div.appendChild(this._animation);
  }

  get targetTile() {
    return this._targetTile;
  }

  createTargetTile() {
    this._targetTile = NewHTMLElement("div", {
      class: ["ghost-target", this._id],
      style: {
        top: "0px",
        left: "0px",
      },
    });
  }

  move(direction) {
    if (this.isOppositeDirection(direction)) return;
    this._direction = direction;

    this._div.className = `walk-${direction}`;
    switch (direction) {
      case DIRECTIONS.UP:
        this._xVel = 0;
        this._yVel = -this._speed;
        break;
      case DIRECTIONS.RIGHT:
        this._xVel = this._speed;
        this._yVel = 0;
        break;
      case DIRECTIONS.DOWN:
        this._xVel = 0;
        this._yVel = this._speed;
        break;
      case DIRECTIONS.LEFT:
        this._xVel = -this._speed;
        this._yVel = 0;
        break;
      default:
        this._xVel = 0;
        this._yVel = 0;
        break;
    }
  }

  stop() {
    this._direction = null;
    this._xVel = 0;
    this._yVel = 0;
  }

  get direction() {
    return this._direction;
  }

  isOppositeDirection(direction) {
    const opposite = {
      [DIRECTIONS.DOWN]: DIRECTIONS.UP,
      [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
      [DIRECTIONS.UP]: DIRECTIONS.DOWN,
      [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
    };

    return this._direction == opposite[direction];
  }

  chaseBehavior(target, vector) {
    return [
      target.xVirt,
      target.yVirt,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }

  setTargetTile(x, y) {
    this._targetTile.style.left = `${x * BLOCK_HEIGHT}px`;
    this._targetTile.style.top = `${y * BLOCK_WIDTH}px`;
  }
}

export const chaseOffsets = {
  [DIRECTIONS.UP]: { x: 0, y: -2 },
  [DIRECTIONS.RIGHT]: { x: 2, y: 0 },
  [DIRECTIONS.DOWN]: { x: 0, y: 2 },
  [DIRECTIONS.LEFT]: { x: -2, y: 0 },
};

export class Blinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "blinky");
  }
}

export class Inky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "inky");
  }

  chaseBehavior(target, vector, ghosts) {
    const blinky = ghosts.blinky;

    const { x, y } = chaseOffsets[target.direction] || { x: 0, y: 0 };

    const tx = target.xVirt;
    const ty = target.yVirt;

    const ax = tx + (tx - blinky.xVirt) + x;
    const ay = ty + (ty - blinky.yVirt) + y;
    const bx = this.xVirt + vector.x;
    const by = this.yVirt + vector.y;

    return [ax, ay, bx, by];
  }
}

export class Pinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "pinky");
  }

  chaseBehavior(target, vector) {
    const { x, y } = chaseOffsets[target.direction] || { x: 0, y: 0 };

    return [
      target.xVirt + x * 2,
      target.yVirt + y * 2,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }
}

export class Clyde extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "clyde");
  }

  chaseBehavior(target, vector) {
    const distance =
      Math.abs(target.xVirt - this.xVirt) + Math.abs(target.yVirt - this.yVirt);
    if (distance < 8) {
      return [0, 23, this.xVirt + vector.x, this.yVirt + vector.y];
    }

    return [
      target.xVirt - 4,
      target.yVirt - 4,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }
}
