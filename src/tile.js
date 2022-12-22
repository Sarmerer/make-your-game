import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./settings.js";
import { GameObject } from "./game-object.js";

export class Tile extends GameObject {
  static FLOOR = "_";
  static WALL = "|";
  static FOOD = ".";
  static PILL = "o";
  static BARRIER = "-";
  static PORTAL = "0";

  static CSS_CLASS = {
    [Tile.FLOOR]: "floor",
    [Tile.WALL]: "wall",
    [Tile.FOOD]: "food",
    [Tile.PILL]: "pill",
    [Tile.BARRIER]: "barrier",
    [Tile.PORTAL]: "portal",
  };

  constructor(type = Tile.FLOOR) {
    super();

    this.type = type;

    this.elProps = {
      classList: ["tile", Tile.CSS_CLASS[this.type]],
      style: {
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_HEIGHT}px`,
      },
    };
  }

  onCollide() {
    this.el.classList.remove(Tile.CSS_CLASS[this.type]);
  }
}
