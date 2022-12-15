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

import { TILE } from "./tile.js";

export class Game {
  constructor() {
    this._gameArea = document.getElementById("game-area");
    this._canvas = document.getElementById("canvas");

    this.world = null;
    this.player = null;

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

  create_() {
    this.world = new World();
    this._scoreToWin =
      this.world.map.flat().filter((c) => c === TILE.FOOD).length *
      this._scorePerFood;

    this.spawnPlayer();
    this.spawnGhosts();

    const map = this.world.create_();
    this._canvas.append(map);
    this.toggleDebugMode();
  }

  start() {
    this.draw_();
  }

  restart() {
    this._canvas.innerHTML = "";

    this._score = 0;
    this._scoreDiv.textContent = `${this._score}`;

    this.world = new World();
    this._scoreToWin =
      this.world.map.flat().filter((c) => c === TILE.FOOD).length *
      this._scorePerFood;

    this.player.el.remove();
    for (const ghost of Object.values(this._ghosts)) {
      ghost.el.remove();
    }

    this.world = new World();
    this._scoreToWin =
      this.world.map.flat().filter((c) => c === TILE.FOOD).length *
      this._scorePerFood;

    this.spawnPlayer();
    this.spawnGhosts();

    const map = this.world.create_();
    this._canvas.append(map);
  }

  update_() {
    for (const g of Object.values(this._ghosts)) {
      if (g.xVirt == this.player.xVirt && g.yVirt == this.player.yVirt) {
        this.restart();
      }
    }

    if (!settings.freezeGhosts) this.moveGhosts();
    this.movePlayer();

    this.draw_();
  }

  draw_() {
    for (const g of Object.values(this._ghosts)) {
      g.draw_();
    }
    this.player.draw_();
  }

  movePlayer() {
    const vec = directionToVector(this.player.direction);
    if (!vec) return;

    const now = Date.now();
    const deltaT = (now - this.player.lastMoved) / 1000;

    const distance = this.player._speed * deltaT;
    this.player.lastMoved = now;

    if (!this.isPlayerAbleToGo(this.player.direction)) return;

    this.player.xVel = vec.x * distance;
    this.player.yVel = vec.y * distance;
    this.player.x += this.player.xVel;
    this.player.y += this.player.yVel;

    const tile = this.world.tiles.get(
      `${this.player.yVirt}-${this.player.xVirt}`
    );

    if (tile) {
      tile.onCollide();
    }
  }

  moveGhosts() {
    for (const ghost of Object.values(this._ghosts)) {
      this.moveGhost(ghost);
    }
  }

  async moveGhost(ghost) {
    ghost.x += ghost.xVel;
    ghost.y += ghost.yVel;

    if (ghost.xVel !== 0 && ghost.x % BLOCK_WIDTH) return;
    if (ghost.yVel !== 0 && ghost.y % BLOCK_HEIGHT) return;

    const availableDirections = this.ghostCanGo(ghost);

    if (ghost.direction && !availableDirections.includes(ghost.direction)) {
      const nextDirection = {
        [DIRECTIONS.UP]: DIRECTIONS.LEFT,
        [DIRECTIONS.DOWN]: DIRECTIONS.RIGHT,
        [DIRECTIONS.LEFT]: DIRECTIONS.DOWN,
        [DIRECTIONS.RIGHT]: DIRECTIONS.UP,
      };

      let currentDir = ghost.direction;

      let bestDir = null;
      // while (!bestDir) {
      //   if (availableDirections.includes(nextDirection[currentDir])) {
      //     bestDir = nextDirection[currentDir];
      //   } else {
      //     currentDir = nextDirection[currentDir];
      //   }
      // }

      if (!bestDir) return ghost.stop();
      ghost.move(bestDir);
    }

    const vectorCache = [];
    const vectors = availableDirections.map((dir) => {
      const vector = directionToVector(dir);
      const args = ghost.currentBehavior().apply(ghost, [vector]);

      vectorCache.push({ ax: args[0], ay: args[1] });

      return vectorMagnitude(...args);
    });

    const shortestIndex = shortestVectorIndex(vectors);
    ghost._targetX = vectorCache[shortestIndex].ax;
    ghost._targetY = vectorCache[shortestIndex].ay;

    const direction = availableDirections[shortestIndex];

    ghost.move(direction);
  }

  ghostCanGo(ghost, direction) {
    const directions = [];

    const availableDirections = this.getAvailableDirections(
      ghost.xVirt,
      ghost.yVirt
    );

    for (const dir of Object.keys(availableDirections)) {
      const v = directionToVector(dir);
      const x = ghost.xVirt + v.x;
      const y = ghost.yVirt + v.y;

      const tile = this.world.getTile(x, y);
      if (!tile) continue;

      if (
        (this.world.isInBounds(x, y) && tile._type == TILE.WALL) ||
        (tile._type === TILE.BARRIER && !ghost._inTheHouse)
      )
        continue;

      directions.push(dir);
    }

    const opp = ghost.oppositeDirection();
    return directions.filter((dir) => dir !== opp);
  }

  getAvailableDirections(x, y) {
    const tilesAround = [
      { x: x - 1, y, dir: DIRECTIONS.LEFT },
      { x: x + 1, y, dir: DIRECTIONS.RIGHT },
      { x, y: y - 1, dir: DIRECTIONS.UP },
      { x, y: y + 1, dir: DIRECTIONS.DOWN },
    ];

    return tilesAround.reduce((acc, tile) => {
      if (this.world.tileIsFree(tile.x, tile.y)) acc[tile.dir] = true;
      return acc;
    }, {});
  }

  isPlayerAbleToGo(direction) {
    return (
      direction in
      this.getAvailableDirections(this.player.xVirt, this.player.yVirt)
    );
  }

  spawnPlayer() {
    this.player = new Player(270, 420);
    this.player.create_();
    this._canvas.appendChild(this.player.el);
  }

  spawnGhosts() {
    const b = new Blinky(390, 420);
    this._ghosts[b.id] = b;

    const i = new Inky(420, 420);
    this._ghosts[i.id] = i;

    const p = new Pinky(390, 450);
    this._ghosts[p.id] = p;

    const c = new Clyde(420, 450);
    this._ghosts[c.id] = c;

    for (const g of Object.values(this._ghosts)) {
      g.create_();
      this._canvas.appendChild(g.el);
    }
  }

  toggleDebugModeForObject_(o) {
    if (settings.debugMode) {
      return o.debugEnable_();
    }

    o.debugDisable_();
    return [];
  }

  toggleDebugMode() {
    const elements = [];
    elements.push(...this.toggleDebugModeForObject_(this.player));
    for (const g of Object.values(this._ghosts)) {
      elements.push(...this.toggleDebugModeForObject_(g));
    }

    for (const e of elements) {
      this._canvas.appendChild(e);
    }
  }
}
