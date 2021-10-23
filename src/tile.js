import { NewHTMLElement } from "./utils.js";
import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./constants.js";

export const TILES = {
  FLOOR: "_",
  WALL: "|",
  FOOD: ".",
  PILL: "o",
  BARRIER: "-",
};

export function getTile(tile) {
  return Object.values(TILES).find((t) => t === tile) || TILES.FLOOR;
}

export const EVENTS = {
  ATE_FOOD: "ate-food",
  ATE_PILL: "ate-pill",
};

export class Tile {
  constructor(type = TILES.FLOOR) {
    this._type = getTile(type);
    this.onCollide = null;

    const classes = ["tile"];

    if (this.typeIs(TILES.WALL)) classes.push("wall");
    if (this.typeIs(TILES.FOOD)) classes.push("food");
    if (this.typeIs(TILES.PILL)) classes.push("pill");
    if (this.typeIs(TILES.BARRIER)) classes.push("barrier");
    if (this.typeIs(TILES.PORTAL)) classes.push("portal");

    this._div = NewHTMLElement("div", {
      class: classes,
      style: {
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_HEIGHT}px`,
      },
    });
    if (this.typeIs(TILES.FOOD, TILES.PILL)) {
      const isFood = this.typeIs(TILES.FOOD);
      this.onCollide = isFood ? this.onCollideFood : this.onCollidePill;
      const child = NewHTMLElement("div", {
        style: {
          width: isFood ? "4px" : "10px",
          height: isFood ? "4px" : "10px",
          backgroundColor: isFood ? "white" : "yellow",
        },
      });
      this._div.appendChild(child);
    }
  }

  onCollideFood() {
    if (this._div.hasChildNodes()) {
      this._div.innerHTML = "";
      return EVENTS.ATE_FOOD;
    }
  }
  onCollidePill() {
    if (this._div.hasChildNodes()) {
      this._div.innerHTML = "";
      return EVENTS.ATE_PILL;
    }
  }

  typeIs(...types) {
    return types.includes(this._type);
  }

  get div() {
    return this._div;
  }
}
