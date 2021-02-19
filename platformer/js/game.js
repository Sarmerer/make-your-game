class Game {
  /**
   * @param {Number} height - world height
   * @param {Number} width - world - width
   */
  constructor(height = 500, width = 500) {
    this.world = {
      height: height,
      width: width,
      gravity: 1.5,
      friction: 0.9,

      player: new Player(0, 0, 20, 20),
      tileset: new TileSet("../assets/sheet.png", 490, 490, 70, 70),
      map: [
        // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      colliders: [],
      tiles: [],

      resolveCollisions(player) {
        this.colliders.forEach(function (c) {
          c.detectCollision(player);
        });
      },

      rescale(xScale, yScale) {
        //this.rescaleMap(xScale, yScale);
        this.rescaleColliders(xScale, yScale);
      },
      /**
       * @param {Number} xScale - new X scale
       * @param {Number} yScale - new Y scale
       */
      rescaleColliders(xScale, yScale) {
        this.colliders.forEach((coll) => {
          coll.width = coll.initialWidth * xScale;
          coll.height = coll.initialHeight * yScale;
        });
      },
      /**
       * @param {Number} xScale - new X scale
       * @param {Number} yScale - new Y scale
       */
      rescaleMap(xScale, yScale) {
        this.tiles.forEach((tile) => {
          if (!tile.style) return;
          //tile.style.transform = `scale(${xScale}, ${yScale})`;
          tile.style.width = px(tile.initialWidth * xScale);
        });
      },
      draw: function () {
        let canvas = document.getElementById("canvas");

        let world = new Game.Collider.RectInner(0, 0, this.width, this.height);
        this.colliders.push(world);
        this.tiles.push(world);

        for (let i = 0; i < this.map.length; i++) {
          let width = 70; // window.innerWidth / this.map[i].length;
          let height = 70; //window.innerHeight / this.map.length;
          for (let j = 0; j < this.map[i].length; j++) {
            let block = this.map[i][j];
            let div = this.tileset.tiledDiv(
              width,
              height,
              this.tileset.adapter(block)
            );
            div.style.top = px(height * i);
            div.style.left = px(width * j);
            div.style.position = "absolute";
            this.tiles.push(div);
            if (block)
              this.colliders.push(
                new Game.Collider.RectOuter(
                  width * j,
                  height * i,
                  width,
                  height
                )
              );
            canvas.appendChild(div);
          }
        }
      },
      update: function () {
        this.player.yv += this.gravity;
        this.player.update();
        this.player.xv *= this.friction;
        this.resolveCollisions(this.player);
      },
    };
  }
  update() {
    this.world.update();
  }
}
