import { NewHTMLElement } from "./utils.js";
import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./config.js";

export const TILES = {
  FLOOR: 0,
  WALL: 1,
  FOOD: 2,
  PILL: 3,
  BARRIER: 4,
  PORTAL: 5,

  getKey(value) {
    const tile = Object.entries(this).find(([, v]) => v === value);
    return tile.length ? this[tile[0]] : this.FLOOR;
  },
};

export const EVENTS = {
  ATE_FOOD: "ate-food",
  ATE_PILL: "ate-pill",
};

export class Tile {
  constructor(type = TILES.FLOOR) {
    this._type = TILES.getKey(type);
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
