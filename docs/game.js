import {
  BLOCK_WIDTH,
  BLOCK_HEIGHT,
  DIRECTIONS,
  directionToVector,
} from "./constants.js";

import { settings, toggleSetting } from "./settings.js";

import { Player } from "./player.js";
import { Blinky, Clyde, Ghost, Inky, Pinky } from "./ghost.js";
import { World } from "./world.js";

import { shortestVectorIndex, vectorMagnitude } from "./utils.js";

import { TILES, EVENTS } from "./tile.js";

export class Game {
  constructor() {
    this._gameArea = this.getOrCreateGameContainer("game-area");
    this._canvas = this.getOrCreateGameContainer("canvas");

    this._world = null;
    this._player = null;

    this._score = 0;
    this._scorePerFood = 10;
    this._scoreToWin = 0;

    this._scoreDiv = document.getElementById("score");
    if (!this._scoreDiv) {
      this._scoreDiv = document.createElement("div");
      this._scoreDiv.id = "score";
      this._canvas.appendChild(this._scoreDiv);
    }

    this._ghosts = {};
  }

  init() {
    this._world = new World();
    this._scoreToWin =
      this._world.map.flat().filter((c) => c === TILES.FOOD).length *
      this._scorePerFood;

    this.spawnPlayer();
    this.spawnGhosts();

    const map = this._world.draw();
    this._canvas.append(map);
  }

  start() {
    this.draw();
  }

  restart() {
    this._canvas.innerHTML = "";

    this._score = 0;
    this._scoreDiv.textContent = `${this._score}`;

    this._world = new World();
    this._scoreToWin =
      this._world.map.flat().filter((c) => c === TILES.FOOD).length *
      this._scorePerFood;

    this._player.div.remove();
    for (const ghost of Object.values(this._ghosts)) {
      ghost.div.remove();
    }

    this._world = new World();
    this._scoreToWin =
      this._world.map.flat().filter((c) => c === TILES.FOOD).length *
      this._scorePerFood;

    this.spawnPlayer();
    this.spawnGhosts();

    const map = this._world.draw();
    this._canvas.append(map);
  }

  update() {
    for (const g of Object.values(this._ghosts)) {
      if (g.xVirt == this._player.xVirt && g.yVirt == this._player.yVirt) {
        this.restart();
      }
    }

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

    if (tile?.onCollide) this.callEvent(tile.onCollide());
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

    if (ghost.direction && !availableDirections.includes(ghost.direction))
      return ghost.stop();

    const vectorCache = [];
    const vectors = availableDirections.map((dir) => {
      const vector = directionToVector(dir);
      const args = ghost.chaseBehavior(this._player, vector, this._ghosts);

      vectorCache.push({ ax: args[0], ay: args[1] });

      return vectorMagnitude(...args);
    });

    const shortestIndex = shortestVectorIndex(vectors);

    if (settings.debugMode) {
      ghost.setTargetTile(
        vectorCache[shortestIndex].ax,
        vectorCache[shortestIndex].ay
      );
    }

    const direction = availableDirections[shortestIndex];

    ghost.move(direction);
  }

  ghostCanGo(ghost) {
    const directions = [];

    for (const dir of Object.values(DIRECTIONS)) {
      const v = directionToVector(dir);
      const x = ghost.xVirt + v.x;
      const y = ghost.yVirt + v.y;

      if (this._world.tileIsFree(x, y)) directions.push(dir);
    }

    return directions;
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
      case DIRECTIONS.UP:
        return this.playerCanGoUp();
      case DIRECTIONS.DOWN:
        return this.playerCanGoDown();
      case DIRECTIONS.LEFT:
        return this.playerCanGoLeft();
      case DIRECTIONS.RIGHT:
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

  spawnPlayer() {
    this._player = new Player(270, 420);
    this._canvas.appendChild(this._player.div);
  }
  spawnGhosts() {
    const b = new Blinky(240, 360);
    this._ghosts[b._id] = b;

    const i = new Inky(270, 360);
    this._ghosts[i._id] = i;

    const p = new Pinky(300, 360);
    this._ghosts[p._id] = p;

    const c = new Clyde(330, 360);
    this._ghosts[c._id] = c;

    if (settings.debugMode) {
      this.createTargetTilesForGhosts();
    }

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

  createTargetTilesForGhosts() {
    for (const g of Object.values(this._ghosts)) {
      this._canvas.appendChild(g.createTargetTile());
    }
  }

  toggleDebugMode() {
    if (settings.debugMode) {
      for (const g of Object.values(this._ghosts)) {
        g.removeTargetTile();
      }
      return toggleSetting("debugMode");
    }

    this.createTargetTilesForGhosts();
    toggleSetting("debugMode");
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}
