import { BLOCK_WIDTH, BLOCK_HEIGHT } from "./config.js";
import { Player } from "./player.js";
import { Blinky, Clyde, Ghost, Inky, Pinky } from "./ghost.js";
import { World } from "./world.js";

import { shortestVectorIndex, vectorMagnitude } from "./utils.js";

import { TILES, EVENTS } from "./tile.js";

export class Game {
  constructor() {
    this._gameArea = this.getOrCreateGameContainer("game-area");
    this._canvas = this.getOrCreateGameContainer("canvas");

    this._world = new World();
    this._player = new Player();
    this._canvas.appendChild(this._player.div);
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

    this._ghosts = {};
    this.spawnGhosts();
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
    for (const ghost of Object.values(this._ghosts)) {
      this.moveGhost(ghost);
    }
  }

  async moveGhost(ghost) {
    ghost.x += ghost.xv;
    ghost.y += ghost.yv;

    if (ghost.xv !== 0 && ghost.x % BLOCK_WIDTH) return;
    if (ghost.yv !== 0 && ghost.y % BLOCK_HEIGHT) return;

    const availableDirections = this.ghostCanGo(ghost);

    if (
      ghost.currentDirection &&
      !availableDirections.some((d) => d.direction == ghost.currentDirection)
    )
      return ghost.stop();

    const vectors = availableDirections.map((dir) => {
      const args = ghost.chaseBehavior(this._player, this._ghosts, dir);
      return vectorMagnitude(...args);
    });

    const longest = shortestVectorIndex(vectors);
    const direction = availableDirections[longest].direction;

    ghost.move(direction);
  }

  ghostCanGo(ghost) {
    const directions = [];

    const variants = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    for (const [k, v] of Object.entries(variants)) {
      if (this._world.tileIsFree(ghost.xVirt + v.x, ghost.yVirt + v.y))
        directions.push({ direction: k, ...v });
    }

    return directions;
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
    for (const g of Object.values(this._ghosts)) {
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
    return this._world.tileIsFree(this._player.xVirt, this._player.yVirt - 1);
  }
  playerCanGoDown() {
    return this._world.tileIsFree(this._player.xVirt, this._player.yVirt + 1);
  }
  playerCanGoLeft() {
    return this._world.tileIsFree(this._player.xVirt - 1, this._player.yVirt);
  }
  playerCanGoRight() {
    return this._world.tileIsFree(this._player.xVirt + 1, this._player.yVirt);
  }

  spawnGhosts() {
    const p = new Pinky(30, 30);
    this._ghosts[p._id] = p;

    const i = new Inky(500, 500);
    this._ghosts[i._id] = i;

    const c = new Clyde(100, 500);
    this._ghosts[c._id] = c;

    const b = new Blinky(500, 100);
    this._ghosts[b._id] = b;

    for (const g of Object.values(this._ghosts)) {
      this._canvas.appendChild(g.div);
    }
  }

  getOrCreateGameContainer(elementId) {
    let el = document.getElementById(elementId);

    if (!el) {
      el = document.createElement("div");
      el.id = elementId;
      this._gameArea.appendChild(el);
    }

    return el;
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}
