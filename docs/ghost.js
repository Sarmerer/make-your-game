import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";
import { ghostSpeed } from "./config.js";
import { vectorMagnitude } from "./utils.js";

export class Ghost extends Actor {
  constructor(x = 90, y = 90, id = "ghost") {
    super(x, y);
    this._id = id;
    this._speed = ghostSpeed;
    this._currentDirection = null;
    this._div = NewHTMLElement("div", {
      id: id,
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

  move(direction) {
    if (this.isOppositeDirection(direction)) return;
    this._currentDirection = direction;

    this._div.className = `walk-${direction}`;
    switch (direction) {
      case "left":
        this._xVel = -this._speed;
        this._yVel = 0;
        break;
      case "right":
        this._xVel = this._speed;
        this._yVel = 0;
        break;
      case "up":
        this._xVel = 0;
        this._yVel = -this._speed;
        break;
      case "down":
        this._xVel = 0;
        this._yVel = this._speed;
        break;
      default:
        this._xVel = 0;
        this._yVel = 0;
        break;
    }
  }

  stop() {
    this._currentDirection = null;
    this._xVel = 0;
    this._yVel = 0;
  }

  get currentDirection() {
    return this._currentDirection;
  }

  isOppositeDirection(direction) {
    const opposite = {
      left: "right",
      right: "left",
      up: "down",
      down: "up",
    };

    return this._currentDirection == opposite[direction];
  }

  isBlinky() {
    return this._id == "blinky";
  }

  isInky() {
    return this._id == "inky";
  }

  isPinky() {
    return this._id == "pinky";
  }

  isClyde() {
    return this._id == "clyde";
  }
}

export class Pinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "pinky");
  }

  chaseBehavior(pacman, ghosts, direction) {
    return [
      pacman.xVirt - 4,
      pacman.yVirt - 4,
      this.xVirt + direction.x,
      this.yVirt + direction.y,
    ];
  }
}

export class Inky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "inky");
  }

  chaseBehavior(pacman, ghosts, direction) {
    const blinky = ghosts.blinky;

    const xAxis =
      pacman.direction == "left" || pacman.direction == "right" ? 1 : 0;

    const sign =
      pacman.direction == "left" || pacman.direction == "up" ? -1 : 1;

    const xOffset = xAxis ? 2 * sign : 0;
    const yOffset = xAxis ? 0 : 2 * sign;

    const ax = (Math.abs(blinky.xVirt - pacman.xVirt) + xOffset) * 2;
    const ay = (Math.abs(blinky.yVirt - pacman.yVirt) + yOffset) * 2;
    const bx = this.xVirt + direction.x;
    const by = this.yVirt + direction.y;

    return [ax, ay, bx, by];
  }
}

export class Blinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "blinky");
  }

  chaseBehavior(pacman, ghosts, direction) {
    return [
      pacman.xVirt,
      pacman.yVirt,
      this.xVirt + direction.x,
      this.yVirt + direction.y,
    ];
  }
}

export class Clyde extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "clyde");
  }

  chaseBehavior(pacman, ghosts, direction) {
    return [
      pacman.xVirt - 4,
      pacman.yVirt - 4,
      this.xVirt + direction.x,
      this.yVirt + direction.y,
    ];
  }
}
