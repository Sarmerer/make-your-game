import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./config.js";
import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";
import { playerSpeed } from "./config.js";

export class Player extends Actor {
  constructor() {
    super();
    this._speed = playerSpeed;
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
    switch (dir) {
      case "up":
        this.goUp();
        break;
      case "down":
        this.goDown();
        break;
      case "left":
        this.goLeft();
        break;
      case "right":
        this.goRight();
        break;
    }
  }

  goUp() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = -this._speed;
    this._xVel = 0;
    this._div.className = "animate walk-up";
    this._direction = "up";
  }
  goDown() {
    if (this._x % BLOCK_HEIGHT) return;
    this._yVel = this._speed;
    this._xVel = 0;
    this._div.className = "animate walk-down";
    this._direction = "down";
  }
  goLeft() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = -this._speed;
    this._div.className = "animate walk-left";
    this._direction = "left";
  }
  goRight() {
    if (this._y % BLOCK_WIDTH) return;
    this._yVel = 0;
    this._xVel = this._speed;
    this._div.className = "animate walk-right";
    this._direction = "right";
  }

  draw() {
    this.div.style.top = `${this.y}px`;
    this.div.style.left = `${this.x}px`;
  }

  get direction() {
    return this._direction;
  }
}
