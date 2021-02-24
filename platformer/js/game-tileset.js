const tilesAdapter = {
  0: 6, // empty block
  1: 7, // platform
};

class TileSet {
  /**
   * @param {String} url - tileset url
   * @param {Number} sheetWidth - tileshet width
   * @param {Number} sheetHeight - tileset height
   * @param {Number} tileWidth- tile height
   * @param {Number} tileHeight - tile height
   */
  constructor(url, sheetWidth, sheetHeight, tileWidth, tileHeight) {
    this.url = url;
    this.sheetWidth = sheetWidth;
    this.sheetHeight = sheetHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  adapter(block) {
    return tilesAdapter[block] || 0;
  }
  /**
   * @param {Number} divWidth - width of a tile
   * @param {Number} divHeight - height of a tile
   * @param {Number} tileIndex - index of a tile in a tileset, counting starts from 0
   * @returns {HTMLElement} - div with specified width, height and tile image
   */
  tiledDiv(divWidth, divHeight, tileIndex) {
    let tile = document.createElement("div");
    tile.initialWidth = divWidth;
    tile.initialHeight = divHeight;
    tile.style.width = px(divWidth);
    tile.style.height = px(divHeight);
    tile.style.backgroundSize = `${this.sheetWidth}px ${this.sheetHeight}[x]`;
    tile.style.backgroundImage = `url(../assets/sheet.png)`;
    tile.style.backgroundRepeat = "norepeat";
    tile.style.backgroundPosition = this.disposition(tileIndex);
    return tile;
  }
  /**
   * Calculates x and y disposition for a specified tile index
   * @param {Number} tileIndex -
   * @returns {String}
   */
  disposition(tileIndex) {
    let tilesPerRow = this.sheetWidth / this.tileWidth;
    let tilesPerColumn = this.sheetHeight / this.tileHeight;

    if (tileIndex > tilesPerRow * tilesPerColumn) return "0px 0px";
    if (tileIndex < tilesPerRow)
      return `${this.sheetWidth - this.tileWidth * tileIndex}px ${
        this.sheetHeight
      }px`;

    let offset = Math.floor(tileIndex / tilesPerRow);
    return `${
      this.sheetWidth - this.tileWidth * (tileIndex - tilesPerRow * offset)
    }px ${this.sheetHeight - this.tileHeight * offset}px`;
  }
}
