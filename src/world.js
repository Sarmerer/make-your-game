import { NewHTMLElement } from "./utils.js";
import { TILES } from "./tile.js";
import { Tile } from "./tile.js";
import { mapgen } from "./mapgen/mapgen.js";

export class World {
  constructor() {
    // prettier-ignore
    this._map = mapgen()
    this.width = this._map[0].length;
    this.height = this._map.length;

    this._tiles = new Map();
  }

  get map() {
    return this._map;
  }

  get tiles() {
    return this._tiles;
  }

  draw() {
    const map = NewHTMLElement("div", {
      style: {
        display: "grid",
        gridTemplateRows: `repeat(${this.height}, 30px)`,
        gridTemplateColumns: `repeat(${this.width}, 30px)`,
      },
    });
    for (let y = 0; y < this.height; y++) {
      const row = this.map[y];
      for (let x = 0; x < row.length; x++) {
        const tile = new Tile(this.map[y][x]);
        map.appendChild(tile.div);
        this.tiles.set(`${y}-${x}`, tile);
      }
    }
    return map;
  }

  getTile(x, y) {
    return this._tiles.get(`${y}-${x}`);
  }

  tileIsWall(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
    const tile = this.map[y][x];
    if (tile === TILES.WALL) {
      return true;
    }
    return false;
  }

  tileIsFree(x, y) {
    return !this.tileIsWall(x, y);
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
