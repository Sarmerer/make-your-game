import { mapgen as generateMap } from "./mapgen.js";
import { NewHTMLElement } from "./utils.js";
import { Tile } from "./tile.js";

export class World {
  constructor() {
    this.tiles = new Map();
  }

  create_() {
    const map = generateMap();
    const width = map[0].length;
    const height = map.length;
    const el = NewHTMLElement("div", {
      style: {
        display: "grid",
        gridTemplateRows: `repeat(${height}, 30px)`,
        gridTemplateColumns: `repeat(${width}, 30px)`,
      },
    });
    for (let y = 0; y < height; y++) {
      const row = map[y];
      for (let x = 0; x < row.length; x++) {
        const tile = new Tile(map[y][x]);
        tile.create_();
        el.appendChild(tile.el);
        this.tiles.set(`${y}-${x}`, tile);
      }
    }
    return el;
  }

  getTile(x, y) {
    return this.tiles.get(`${y}-${x}`);
  }
}
