import {
  PLAYER_SPEED as SPEED,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  DIRECTIONS,
  validDirection,
} from "./constants.js";
import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";

export class Player extends Actor {
  constructor(x, y) {
    super(x, y);
    this._speed = SPEED;
    this._direction = null;
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

  go(dir) {
    const valid = validDirection(dir);
    if (valid) {
      this._direction = dir;
    }

    switch (dir) {
      case DIRECTIONS.UP:
        this.goUp();
        break;
      case DIRECTIONS.DOWN:
        this.goDown();
        break;
      case DIRECTIONS.LEFT:
        this.goLeft();
        break;
      case DIRECTIONS.RIGHT:
        this.goRight();
        break;
    }
  }

  goUp() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = -this._speed;
    this._xVel = 0;
    this._div.className = "animate walk-up";
  }
  goDown() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = this._speed;
    this._xVel = 0;
    this._div.className = "animate walk-down";
  }
  goLeft() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = -this._speed;
    this._div.className = "animate walk-left";
  }
  goRight() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = this._speed;
    this._div.className = "animate walk-right";
  }

  get direction() {
    return this._direction;
  }

  velocitySign() {
    return this._direction == DIRECTIONS.UP ||
      this._direction == DIRECTIONS.LEFT
      ? -1
      : 1;
  }
}
