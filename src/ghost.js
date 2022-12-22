import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./settings.js";
import { vectorMagnitude } from "./utils.js";
import { Direction } from "./direction.js";
import { Actor } from "./actor.js";
import { Tile } from "./tile.js";

export class Ghost extends Actor {
  constructor(x = 90, y = 90, id = "ghost") {
    super(x, y);
    this.tags = ["ghost", id];
    this.id = id;
    this.speed = 1.25;

    this.targetX_ = 0;
    this.targetY_ = 0;

    this.isInHouse_ = true;
    this.isInScatter_ = true;
    this.scatterChangeTimestamp_ = Date.now();

    this.elProps = {
      id: id,
      classList: ["ghost"],
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
      },
    };
  }

  get blockedBy() {
    if (this.isInHouse()) return [Tile.WALL];
    return [Tile.WALL, Tile.BARRIER];
  }

  update(game) {
    this.x += this.xVel;
    this.y += this.yVel;

    if (this.xVel !== 0 && this.x % BLOCK_WIDTH) return;
    if (this.yVel !== 0 && this.y % BLOCK_HEIGHT) return;

    const availableDirections = this.getAvailableDirections(game.world);
    if (!availableDirections.length) return;

    const bestDirection = availableDirections
      .reduce((acc, dir) => {
        const args = this.behave(dir, game);
        acc.push({
          x: args[0],
          y: args[1],
          dir: dir.direction,
          mag: vectorMagnitude(...args),
        });
        return acc;
      }, [])
      .sort((a, b) => a.mag - b.mag)[0];

    this.targetX_ = bestDirection.x;
    this.targetY_ = bestDirection.y;

    // if (
    //   !this.direction.isNone() &&
    //   !this.direction.isAvailableWithin(availableDirections)
    // ) {
    //   let best = this.direction.toNext();
    //   for (let i = 0; i < 4; i++) {
    //     if (best.isAvailableWithin(availableDirections)) {
    //       break;
    //     }

    //     best = best.toNext();
    //   }
    // }

    this.direction.change(bestDirection.dir);
    this.yVel = this.direction.y * this.speed;
    this.xVel = this.direction.x * this.speed;
  }

  isInHouse() {
    if (!this.isInHouse_) {
      return false;
    }

    if (this.yVirt <= this.targetY_) {
      this.isInHouse_ = false;
    }

    return this.isInHouse_;
  }

  isInScatter() {
    if (this.isInHouse_) return false;

    const d = Date.now();
    if (d - this.scatterChangeTimestamp_ > 5000) {
      this.isInScatter_ = !this.isInScatter_;
      this.scatterChangeTimestamp_ = d;
    }

    return this.isInScatter_;
  }

  getAvailableDirections(world) {
    const opp = this.direction.opposite();
    return this.getAvailableDirections_(world).filter(
      (d) => d.direction != opp
    );
  }

  behave(vec, game) {
    if (this.isInHouse()) return this.exitHouseBehavior(vec, game);
    if (this.isInScatter()) return this.scatterBehavior(vec, game);

    return this.chaseBehavior(vec, game);
  }

  chaseBehavior(vec, game) {
    const player = game.getObjectByTag("player");
    return [player.xVirt, player.yVirt, this.xVirt + vec.x, this.yVirt + vec.y];
  }

  scatterBehavior(vec) {
    return [35, -4, this.xVirt + vec.x, this.yVirt + vec.y];
  }

  exitHouseBehavior(vec) {
    return [13, 11, this.xVirt + vec.x, this.yVirt + vec.y];
  }

  get debuggers() {
    return [
      {
        name: "target",
        handler: (element) => {
          element.style.left = `${this.targetX_ * BLOCK_WIDTH}px`;
          element.style.top = `${this.targetY_ * BLOCK_HEIGHT}px`;
        },
        element: {
          classList: ["ghost-target", this.id],
          style: {
            top: "0px",
            left: "0px",
          },
        },
      },
    ];
  }
}

export const chaseOffsets = {
  [Direction.UP]: { x: 0, y: -2 },
  [Direction.RIGHT]: { x: 2, y: 0 },
  [Direction.DOWN]: { x: 0, y: 2 },
  [Direction.LEFT]: { x: -2, y: 0 },
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

  chaseBehavior(vec, game) {
    const blinky = game.getObjectByTag("blinky");
    const player = game.getObjectByTag("player");

    const { x, y } = chaseOffsets[player.direction] || { x: 0, y: 0 };

    const tx = player.xVirt;
    const ty = player.yVirt;

    const ax = tx + (tx - blinky.xVirt) + x;
    const ay = ty + (ty - blinky.yVirt) + y;
    const bx = this.xVirt + vec.x;
    const by = this.yVirt + vec.y;

    return [ax, ay, bx, by];
  }

  scatterBehavior(vec) {
    return [27, 27, this.xVirt + vec.x, this.yVirt + vec.y];
  }
}

export class Pinky extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "pinky");
  }

  chaseBehavior(vec, game) {
    const player = game.getObjectByTag("player");
    const { x, y } = chaseOffsets[player.direction] || { x: 0, y: 0 };

    return [
      player.xVirt + x * 2,
      player.yVirt + y * 2,
      this.xVirt + vec.x,
      this.yVirt + vec.y,
    ];
  }

  scatterBehavior(vec) {
    return [3, -4, this.xVirt + vec.x, this.yVirt + vec.y];
  }
}

export class Clyde extends Ghost {
  constructor(x = 90, y = 90) {
    super(x, y, "clyde");
  }

  chaseBehavior(vec, game) {
    const target = game.getObjectByTag("player");
    const distance =
      Math.abs(target.xVirt - this.xVirt) + Math.abs(target.yVirt - this.yVirt);
    if (distance < 8) {
      return [0, 23, this.xVirt + vec.x, this.yVirt + vec.y];
    }

    return [
      target.xVirt - 4,
      target.yVirt - 4,
      this.xVirt + vec.x,
      this.yVirt + vec.y,
    ];
  }

  scatterBehavior(vec) {
    return [0, 30, this.xVirt + vec.x, this.yVirt + vec.y];
  }
}
