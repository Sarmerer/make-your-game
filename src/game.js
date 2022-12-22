import { settings } from "./settings.js";

import { Blinky, Clyde, Inky, Pinky } from "./ghost.js";
import { Player } from "./player.js";
import { World } from "./world.js";

export class Game {
  constructor() {
    this.canvas_ = null;

    this.world = null;
    this.objects = {};
    this.objectsCache_ = {};
  }

  create_() {
    this.canvas_ = document.getElementById("canvas");
    this.world = new World();

    this.objects["player"] = new Player(390, 520);
    this.objects["blinky"] = new Blinky(390, 420);
    this.objects["inky"] = new Inky(420, 420);
    this.objects["punky"] = new Pinky(390, 450);
    this.objects["clyde"] = new Clyde(420, 450);

    for (const actor of Object.values(this.objects)) {
      actor.create_();
      this.canvas_.appendChild(actor.el);
    }

    const map = this.world.create_();
    this.canvas_.append(map);
    this.toggleDebugMode();
  }

  destroy_() {
    this.canvas_.innerHTML = "";
    this.objects = {};
    this.objectsCache_ = {};
    this.world = null;
  }

  start() {
    this.update();
  }

  restart() {
    this.destroy_();
    this.create_();
  }

  update() {
    const player = this.getObjectByTag("player");
    for (const g of Object.values(this.getObjectsByTag("ghost"))) {
      if (g.xVirt == player.xVirt && g.yVirt == player.yVirt) {
        this.restart();
        break;
      }
    }

    if (!settings.freezeGhosts) {
      for (const g of this.getObjectsByTag("ghost")) {
        g.update(this);
      }
    }

    this.getObjectByTag("player").update(this);
  }

  draw() {
    for (const actor of Object.values(this.objects)) {
      actor.draw();
    }
  }

  toggleDebugMode() {
    for (const actor of Object.values(this.objects)) {
      if (settings.debugMode) {
        this.canvas_.append(...actor.debugEnable_());
        continue;
      }

      actor.debugDisable_();
    }
  }

  cacheObjects_(tag, objects) {
    this.objectsCache_[tag] = objects;
  }

  getCachedObject_(tag) {
    return this.objectsCache_[tag] || [];
  }

  getObjectByTag(tag, flush = false) {
    let object = this.getCachedObject_(tag)[0];
    if (!object || flush) {
      object = Object.values(this.objects).find((o) => o.tags.includes(tag));
      this.cacheObjects_(tag, [object]);
    }

    return object;
  }

  getObjectsByTag(tag, flush = false) {
    let objects = this.getCachedObject_(tag);
    if (!objects.length || flush) {
      objects = Object.values(this.objects).filter((o) => o.tags.includes(tag));
      this.cacheObjects_(tag, objects);
    }

    return objects;
  }
}
