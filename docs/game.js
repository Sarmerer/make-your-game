class World {
  constructor() {
    this._tiles = new Map();
    // prettier-ignore
    this._map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1],
      [0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1], 
      [1, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 0, 1], 
      [1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1], 
      [0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0],
      [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
      [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.width = this._map[0].length;
    this.height = this._map.length;
  }

  get map() {
    return this._map;
  }

  get tiles() {
    return this._tiles;
  }
}

class Game {
  constructor() {
    this._gameArea = document.getElementById("game-area");
    if (!this._gameArea) {
      this._gameArea = document.createElement("div");
      this._gameArea.id = "game-area";
      document.body.appendChild(this._canvas);
    }
    this._canvas = document.getElementById("canvas");
    if (!this._canvas) {
      this._canvas = document.createElement("div");
      this._canvas.id = "canvas";
      this._gameArea.appendChild(this._canvas);
    }
    this._world = new World();
    this._player = new Player();
    this._canvas.appendChild(this._player.div);
    this._ghosts = [];
    this._score = 0;
    this._scorePerFood = 10;
    this._scoreToWin =
      this._world.map.flat().filter((c) => c === TILES.FOOD).length *
      this._scorePerFood;
    this._scoreDiv = document.getElementById("score");
    if (!this._scoreDiv) {
      this._scoreDiv = document.createElement("div");
      this._scoreDiv.id = "score";
      this._canvas.appendChild(this._scoreDiv);
    }

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

  callEvent(event) {
    if (!event) return;
    if (event === EVENTS.ATE_FOOD) this.updateScore();
  }

  updateScore() {
    this._score += this._scorePerFood;
    this._scoreDiv.textContent = this._score;
  }

  playerDead() {
    return this._ghosts
      .map((g) => `${g.xVirt}-${g.yVirt}`)
      .includes(`${this._player.xVirt}-${this._player.yVirt}`);
  }

  movePlayer() {
    if (this._player.xv < 0 && this.playerCanGoLeft())
      this._player.x += this._player.xv;
    else if (this._player.xv > 0 && this.playerCanGoRight())
      this._player.x += this._player.xv;

    if (this._player.yv < 0 && this.playerCanGoUp())
      this._player.y += this._player.yv;
    else if (this._player.yv > 0 && this.playerCanGoDown())
      this._player.y += this._player.yv;

    const tile = this._world.tiles.get(
      `${this._player.yVirt}-${this._player.xVirt}`
    );
    if (tile.onCollide) this.callEvent(tile.onCollide());
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
        if (
          g.yVirt - 1 > 0 &&
          self._world.map[g.yVirt - 1][g.xVirt] !== TILES.WALL
        )
          directions.push("up");
        if (
          g.xVirt + 1 < self._world.height &&
          self._world.map[g.yVirt + 1][g.xVirt] !== TILES.WALL
        )
          directions.push("down");
        if (
          g.xVirt - 1 > 0 &&
          self._world.map[g.yVirt][g.xVirt - 1] !== TILES.WALL
        )
          directions.push("left");
        if (
          g.xVirt + 1 < self._world.width &&
          self._world.map[g.yVirt][g.xVirt + 1] !== TILES.WALL
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
    const map = NewHTMLElement("div", {
      style: {
        display: "grid",
        gridTemplateRows: `repeat(${this._world.height}, 30px)`,
        gridTemplateColumns: `repeat(${this._world.width}, 30px)`,
      },
    });
    for (let y = 0; y < this._world.map.length; y++) {
      const row = this._world.map[y];
      for (let x = 0; x < row.length; x++) {
        const tile = new Tile(this._world.map[y][x]);
        map.appendChild(tile.div);
        this._world.tiles.set(`${y}-${x}`, tile);
      }
    }
    this._canvas.appendChild(map);
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

  playerCanGoUp() {
    return (
      player.yVirt - 1 >= 0 &&
      world.map[player.yVirt - 1][player.xVirt] !== TILES.WALL
    );
  }
  playerCanGoDown() {
    return (
      player.yVirt + 1 < this._world.height &&
      world.map[player.yVirt + 1][player.xVirt] !== TILES.WALL
    );
  }
  playerCanGoLeft() {
    return (
      player.xVirt - 1 >= 0 &&
      world.map[player.yVirt][player.xVirt - 1] !== TILES.WALL
    );
  }
  playerCanGoRight() {
    return (
      player.xVirt + 1 < this._world.width &&
      world.map[player.yVirt][player.xVirt + 1] !== TILES.WALL
    );
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}
