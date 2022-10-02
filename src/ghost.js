import { NewHTMLElement } from "./utils.js";
import { Actor } from "./actor.js";
import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  DIRECTIONS,
  DIRECTIONS_OPPOSITE,
  directionToString,
  directionToVector,
  GHOST_SPEED as SPEED,
} from "./constants.js";

export class Ghost extends Actor {
  constructor(x = 90, y = 90, id = "ghost") {
    super(x, y);
    this._id = id;
    this._speed = SPEED;
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
    this._scatterMode = true;
    this._inTheHouse = true;
    this._scatterModeTimestamp = Date.now();

    this._animation = new Image(30, 30);
    this._animation.src = "./assets/pacman.png";
    this._div.appendChild(this._animation);
  }

  get targetTile() {
    return this._targetTile;
  }

  get scatterMode() {
    return this._scatterMode;
  }

  setScatterMode(scatterMode) {
    this._scatterMode = !!scatterMode;
  }

  createTargetTile() {
    this._targetTile = NewHTMLElement("div", {
      class: ["ghost-target", this._id],
      style: {
        top: "0px",
        left: "0px",
      },
    });
    return this._targetTile;
  }

  removeTargetTile() {
    this._targetTile.remove();
    this._targetTile = null;
  }

  move(direction) {
    this._direction = direction;

    const vector = directionToVector(this._direction);

    this._yVel = vector.y * this._speed;
    this._xVel = vector.x * this._speed;
    this._div.className = `walk-${directionToString(this._direction)}`;
  }

  oppositeDirection() {
    return DIRECTIONS_OPPOSITE[this._direction];
  }

  stop() {
    this._direction = null;
    this._xVel = 0;
    this._yVel = 0;
  }

  currentBehavior() {
    if (this._inTheHouse) return this.exitHouseBehavior;
    if (this._scatterMode) return this.scatterBehavior;

    return this.chaseBehavior;
  }

  chaseBehavior(target, vector) {
    this.enterScatterMode();
    return [
      target.xVirt,
      target.yVirt,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }

  scatterBehavior(vector) {
    this.leaveScatterMode();
    return [35, -4, this.xVirt + vector.x, this.yVirt + vector.y];
  }

  enterScatterMode() {
    const d = Date.now();
    if (d - this._scatterModeTimestamp > 5000) {
      this._scatterMode = true;
      this._scatterModeTimestamp = d;
    }
  }

  exitHouseBehavior() {
    return [13, 8, this.xVirt, this.yVirt];
  }

  leaveScatterMode() {
    const d = Date.now();
    if (d - this._scatterModeTimestamp > 5000) {
      this._scatterMode = false;
      this._scatterModeTimestamp = d;
    }
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

    this.enterScatterMode();
    return [ax, ay, bx, by];
  }

  scatterBehavior(vector) {
    this.leaveScatterMode();
    return [27, 27, this.xVirt + vector.x, this.yVirt + vector.y];
  }
}

export class Pinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "pinky");
  }

  chaseBehavior(target, vector) {
    const { x, y } = chaseOffsets[target.direction] || { x: 0, y: 0 };

    this.enterScatterMode();
    return [
      target.xVirt + x * 2,
      target.yVirt + y * 2,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }

  scatterBehavior(vector) {
    this.leaveScatterMode();
    return [3, -4, this.xVirt + vector.x, this.yVirt + vector.y];
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

    this.enterScatterMode();
    return [
      target.xVirt - 4,
      target.yVirt - 4,
      this.xVirt + vector.x,
      this.yVirt + vector.y,
    ];
  }

  scatterBehavior(vector) {
    this.leaveScatterMode();
    return [0, 30, this.xVirt + vector.x, this.yVirt + vector.y];
  }
}
