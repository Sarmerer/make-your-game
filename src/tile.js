import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./constants.js";
import { GameObject } from "./game-object.js";

export const TILE = {
  FLOOR: "_",
  WALL: "|",
  FOOD: ".",
  PILL: "o",
  BARRIER: "-",
  PORTAL: "0",
};

export const TILE_CSS_CLASS = {
  [TILE.FLOOR]: "floor",
  [TILE.WALL]: "wall",
  [TILE.FOOD]: "food",
  [TILE.PILL]: "pill",
  [TILE.BARRIER]: "barrier",
  [TILE.PORTAL]: "portal",
};

export function getTile(tile) {
  return Object.values(TILE).find((t) => t === tile) || TILE.FLOOR;
}

export class Tile extends GameObject {
  constructor(type = TILE.FLOOR) {
    super();

    this.type = getTile(type);

    this.elProps = {
      classList: ["tile", TILE_CSS_CLASS[this.type]],
      style: {
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_HEIGHT}px`,
      },
    };
  }

  onCollide() {
    this.el.classList.remove(TILE_CSS_CLASS[this.type]);
  }
}
