class World {
  constructor() {
    // prettier-ignore
    this._map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1], 
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], 
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1], 
        [0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ];
    this.width = this._map[0].length;
    this.height = this._map.length;
  }

  get map() {
    return this._map;
  }
}

class Game {
  constructor() {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
      canvas = document.createElement("div");
      canvas.id = "canvas";
      document.body.appendChild(div);
    }
    this._canvas = canvas;
    this._world = new World();
    this._player = new Player();
    this._canvas.appendChild(this._player.div);
    this._ghosts = [];

    const colors = ["red", "grey", "cyan", "yellow"];
    const names = ["blinky", "pinky", "inky", "clyde"];
    for (let i = 0; i < 4; i++) {
      const g = new Ghost(30, 30, names[i], colors[i]);
      this._ghosts.push(g);
      this._canvas.appendChild(g.div);
    }
  }

  update() {
    this.moveGhosts();
    this.movePlayer();
    this.draw();
    // if (this.playerDead()) console.log("DEAD");
  }

  playerDead() {
    return this._ghosts
      .map((g) => `${g.virtualX}-${g.virtualY}`)
      .includes(`${this._player.virtualX}-${this._player.virtualY}`);
  }

  movePlayer() {
    if (this._player.xv < 0) {
      if (
        this._player.virtualX - 1 >= 0 &&
        !this._world.map[this._player.virtualY][this._player.virtualX - 1]
      )
        this._player.x += this._player.xv;
    } else if (this._player.xv > 0) {
      if (
        this._player.virtualX + 1 < this._world.width &&
        !this._world.map[this._player.virtualY][this._player.virtualX + 1]
      )
        this._player.x += this._player.xv;
    }
    if (this._player.yv < 0) {
      if (
        this._player.virtualY - 1 >= 0 &&
        !this._world.map[this._player.virtualY - 1][this._player.virtualX]
      )
        this._player.y += this._player.yv;
    } else if (this._player.yv > 0) {
      if (
        this._player.virtualY + 1 < this._world.height &&
        !this._world.map[this._player.virtualY + 1][this._player.virtualX]
      )
        this._player.y += this._player.yv;
    }
  }

  moveGhosts() {
    const self = this;
    for (const g of this._ghosts) {
      move();
      async function move() {
        g.x += g.xv;
        g.y += g.yv;
        if (g.xv !== 0 && g.x % BLOCK_WIDTH) return;
        if (g.yv !== 0 && g.y % BLOCK_HEIGHT) return;
        const directions = [];
        if (g.virtualY - 1 > 0 && !self._world.map[g.virtualY - 1][g.virtualX])
          directions.push("up");
        if (
          g.virtualX + 1 < self._world.height &&
          !self._world.map[g.virtualY + 1][g.virtualX]
        )
          directions.push("down");
        if (g.virtualX - 1 > 0 && !self._world.map[g.virtualY][g.virtualX - 1])
          directions.push("left");
        if (
          g.virtualX + 1 < self._world.width &&
          !self._world.map[g.virtualY][g.virtualX + 1]
        )
          directions.push("right");
        g.move(directions);
      }
    }
  }

  start() {
    this.drawMap();
    this.draw();
  }

  draw() {
    this.drawGhosts();
    this.drawPlayer();
  }

  drawMap() {
    for (let i = 0; i < this._world.map.length; i++) {
      const row = this._world.map[i];
      for (let j = 0; j < row.length; j++) {
        const cell = this._world.map[i][j];
        let div = NewHTMLElement("div", {
          style: {
            width: `${BLOCK_WIDTH}px`,
            height: `${BLOCK_HEIGHT}px`,
            backgroundColor: cell ? "blue" : "black",
            position: " absolute",
            top: `${BLOCK_HEIGHT * i}px`,
            left: `${BLOCK_WIDTH * j}px`,
          },
        });
        this._canvas.appendChild(div);
      }
    }
  }

  drawGhosts() {
    for (const g of this._ghosts) {
      g.div.style.top = `${g.y}px`;
      g.div.style.left = `${g.x}px`;
    }
  }

  drawPlayer() {
    this._player.div.style.top = `${this._player.y}px`;
    this._player.div.style.left = `${this._player.x}px`;
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}
