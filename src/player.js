import { Actor } from "./actor.js";
import { Tile } from "./tile.js";

export class Player extends Actor {
  constructor(x, y) {
    super(x, y);
    this.tags = ["player"];
    this.speed = 200;

    this.elProps = {
      id: "player",
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
        position: "absolute",
      },
    };
  }

  update(game) {
    const now = Date.now();
    const deltaT = (now - this.lastMoved) / 1000;

    this.lastMoved = now;
    const distance = this.speed * deltaT;
    const available = this.getAvailableDirections(game.world);
    if (!this.direction.isAvailableWithin(available)) {
      this.direction.change(null);
      return;
    }

    this.xVel = this.direction.x * distance;
    this.yVel = this.direction.y * distance;
    this.x += this.xVel;
    this.y += this.yVel;

    const tile = game.world.tiles.get(`${this.yVirt}-${this.xVirt}`);

    if (tile) {
      tile.onCollide();
    }
  }

  get blockedBy() {
    return [Tile.WALL, Tile.BARRIER];
  }

  get debuggers() {
    return [
      {
        name: "virt-pos",
        handler: (element) => {
          element.style.left = `${this.x}px`;
          element.style.top = `${this.y}px`;
        },
        element: {
          classList: ["player-virt-pos"],
          style: {
            top: `${this.x}px`,
            left: `${this.y}px`,
          },
        },
      },
    ];
  }
}
