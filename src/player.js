import {
  PLAYER_SPEED as SPEED,
  validDirection,
  directionToString,
} from "./constants.js";
import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";

export class Player extends Actor {
  constructor(x, y) {
    super(x, y);
    this._speed = SPEED;
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

  redirect(dir) {
    if (validDirection(dir)) {
      this._direction = dir;
    }

    this._div.className = `animate walk-${directionToString(this._direction)}`;
  }
}
