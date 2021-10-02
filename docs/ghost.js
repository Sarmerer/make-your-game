import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";
import { ghostSpeed } from "../config.js";

export class Ghost extends Actor {
  constructor(x = 90, y = 90, id = "ghost", color = "red") {
    super(x, y);
    this._speed = ghostSpeed;
    this._currentDirection = null;
    this._div = NewHTMLElement("div", {
      id: id,
      style: {
        width: `${this._width}px`,
        height: `${this._height}px`,
        position: "absolute",
        backgroundColor: color,
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
}
