const TILES = {
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

const EVENTS = {
  ATE_FOOD: "ate-food",
  ATE_PILL: "ate-pill",
};

class Tile {
  constructor(type = TILES.FLOOR) {
    this._type = TILES.getKey(type);
    this.onCollide = null;

    this._div = NewHTMLElement("div", {
      style: {
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_HEIGHT}px`,
        userSelect: "none",
        pointerEvents: "none",
        backgroundColor: "black",
        boxSizing: "border-box",
        border: this.typeIs(TILES.WALL) ? "1px solid blue" : "none",
      },
    });
    if (this.typeIs(TILES.FOOD, TILES.PILL)) {
      Object.assign(this._div.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });
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
