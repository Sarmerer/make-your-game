import {
  PLAYER_SPEED as SPEED,
  directionToString,
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
} from "./constants.js";
import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";

export class Player extends Actor {
  constructor(x, y) {
    super(x, y);
    this._speed = 80;

    this.elProps = {
      id: "player",
      classList: ["animate"],
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
        position: "absolute",
        zIndex: 999,
      },
    };

    this.debuggers = [
      {
        name: "virt-pos",
        handler: this.debugVirtPos,
        element: {
          classList: ["player-virt-pos"],
          style: {
            top: `${this.xVirt * BLOCK_WIDTH}px`,
            left: `${this.yVirt * BLOCK_HEIGHT}px`,
          },
        },
      },
    ];
  }

  redirect(dir) {
    this.direction = dir;
  }

  debugVirtPos(element) {
    element.style.left = `${this.xVirt * BLOCK_WIDTH}px`;
    element.style.top = `${this.yVirt * BLOCK_HEIGHT}px`;
  }
}
