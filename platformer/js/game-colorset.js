const tilesAdapter = {
  0: "black",
  1: "green",
};

class ColorSet {
  constructor() {}

  adapter(block) {
    return tilesAdapter[block] || "black";
  }
  /**
   * @param {Number} divWidth - width of a tile
   * @param {Number} divHeight - height of a tile
   * @param {Number} color - index of a tile in a tileset, counting starts from 0
   * @returns {HTMLElement} - div with specified width, height and tile image
   */
  tiledDiv(divWidth, divHeight, color) {
    let tile = document.createElement("div");
    tile.initialWidth = divWidth;
    tile.initialHeight = divHeight;
    tile.style.width = px(divWidth);
    tile.style.height = px(divHeight);
    tile.style.backgroundColor = color;
    return tile;
  }
}
