import { BLOCK_WIDTH, BLOCK_HEIGHT } from "../config.js";
import { Player } from "./player.js";
import { Ghost } from "./ghost.js";
import { Tile } from "./tile.js";

import { NewHTMLElement, vectorMagnitude } from "./utils.js";

import { TILES, EVENTS } from "./tile.js";

export class World {
  constructor() {
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
      [0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0],
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
}

export class Game {
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

    for (let i = 0; i < names.length; i++) {
      const g = new Ghost(30 + i * 150, 30 + i * 150, names[i], colors[i]);
      this._ghosts.push(g);
      this._canvas.appendChild(g.div);
    }
  }

  update() {
    this.moveGhosts();
    this.movePlayer();
    this.draw();
  }

  callEvent(event) {
    if (!event) return;
    if (event === EVENTS.ATE_FOOD) this.updateScore();
  }

  updateScore() {
    this._score += this._scorePerFood;
    this._scoreDiv.textContent = `${this._score}`;
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
      move(g);
    }

    async function move(ghost) {
      ghost.x += ghost.xv;
      ghost.y += ghost.yv;

      if (ghost.xv !== 0 && ghost.x % BLOCK_WIDTH) return;
      if (ghost.yv !== 0 && ghost.y % BLOCK_HEIGHT) return;

      const availableDirections = ghostCanGo(ghost);

      if (
        ghost.currentDirection &&
        !availableDirections.some((d) => d.direction == ghost.currentDirection)
      )
        return ghost.stop();

      const dir = availableDirections.reduce(
        (acc, dir) => {
          const vMag = vectorMagnitude(
            self._player.xVirt,
            self._player.yVirt,
            ghost.xVirt + (dir.x || 0),
            ghost.yVirt + (dir.y || 0)
          );

          if (acc.length == null || vMag < acc.length) {
            Object.assign(acc, {
              length: vMag,
              direction: dir.direction,
            });
          }

          return acc;
        },
        { length: null }
      );

      const direction = dir.direction;

      ghost.move(direction);
    }

    function ghostCanGo(ghost) {
      const directions = [];
      if (
        ghost.yVirt - 1 > 0 &&
        self._world.map[ghost.yVirt - 1][ghost.xVirt] !== TILES.WALL
      )
        directions.push({ y: -1, direction: "up" });

      if (
        ghost.yVirt + 1 < self._world.height &&
        self._world.map[ghost.yVirt + 1][ghost.xVirt] !== TILES.WALL
      )
        directions.push({ y: 1, direction: "down" });
      if (
        ghost.xVirt - 1 > 0 &&
        self._world.map[ghost.yVirt][ghost.xVirt - 1] !== TILES.WALL
      )
        directions.push({ x: -1, direction: "left" });
      if (
        ghost.xVirt + 1 < self._world.width &&
        self._world.map[ghost.yVirt][ghost.xVirt + 1] !== TILES.WALL
      )
        directions.push({ x: 1, direction: "right" });
      return directions;
    }
  }

  start() {
    const map = this._world.draw();
    this._canvas.append(map);

    this.draw();
  }

  draw() {
    this.drawGhosts();
    this.drawPlayer();
  }

  drawGhosts() {
    for (const g of this._ghosts) {
      g.draw();
    }
  }

  drawPlayer() {
    this._player.draw();
  }

  playerCanGo(dir) {
    switch (dir) {
      case "up":
        return this.playerCanGoUp();
      case "down":
        return this.playerCanGoDown();
      case "left":
        return this.playerCanGoLeft();
      case "right":
        return this.playerCanGoRight();
    }
  }

  playerCanGoUp() {
    return (
      this._player.yVirt - 1 >= 0 &&
      this._world.map[this._player.yVirt - 1][this._player.xVirt] !== TILES.WALL
    );
  }
  playerCanGoDown() {
    return (
      this._player.yVirt + 1 < this._world.height &&
      this._world.map[this._player.yVirt + 1][this._player.xVirt] !== TILES.WALL
    );
  }
  playerCanGoLeft() {
    return (
      this._player.xVirt - 1 >= 0 &&
      this._world.map[this._player.yVirt][this._player.xVirt - 1] !== TILES.WALL
    );
  }
  playerCanGoRight() {
    return (
      this._player.xVirt + 1 < this._world.width &&
      this._world.map[this._player.yVirt][this._player.xVirt + 1] !== TILES.WALL
    );
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}
