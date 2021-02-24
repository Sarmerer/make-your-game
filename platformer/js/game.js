class Game {
  /**
   * @param {Number} height - world height
   * @param {Number} width - world - width
   */
  constructor(width = 500, height = 500) {
    this.world = {
      height: height,
      width: width,
      gravity: 1.5,
      friction: 0.9,

      player: new Player(500, 50, 40, 40),
      tileset: new ColorSet(),
      map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      ],
      colliders: [],
      tiles: [],

      resolveCollisions(player) {
        this.colliders.forEach(function (c) {
          c.detectCollision(player);
        });
      },

      rescale(scale) {
        this.rescaleColliders(scale);
      },
      rescaleColliders(scale) {
        this.colliders.forEach((coll) => {
          coll.width = coll.initialWidth * scale;
          coll.height = coll.initialHeight * scale;
        });
      },

      draw: function () {
        let canvas = document.getElementById("canvas");

        let world = new Game.Collider.RectInner(0, 0, this.width, this.height);
        this.colliders.push(world);
        this.tiles.push(world);

        for (let i = 0; i < this.map.length; i++) {
          let width = 80;
          let height = 80;
          for (let j = 0; j < this.map[i].length; j++) {
            let block = this.map[i][j];
            let div = this.tileset.tiledDiv(
              width,
              height,
              this.tileset.adapter(block)
            );
            div.style.left = px(width * j);
            div.style.top = px(height * i);
            div.style.position = "absolute";
            this.tiles.push(div);
            let colliderDiv, collider;
            if (block !== 0) {
              collider = new Game.Collider.RectOuter(
                width * j,
                height * i,
                width,
                height
              );
              this.colliders.push(collider);
              colliderDiv = NewHTMLElement("div", {
                style: {
                  position: "absolute",
                  width: px(width),
                  height: px(height),
                  top: px(height * i),
                  left: px(width * j),
                  "box-sizing": "border-box",
                  border: "4px solid blue",
                },
              });
            }
            canvas.appendChild(div);
            if (colliderDiv) canvas.appendChild(colliderDiv);
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
