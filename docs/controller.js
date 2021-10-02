import { keyBindings } from "./config.js";

export class Controller {
  constructor() {
    this._keyBindings = keyBindings;

    this._keysDown = {};
    this._queue = null;

    this._keyBindings.forEach((key) => {
      this._keysDown[key.action] = new Controller.Input();
    });
  }

  get bindings() {
    return this._keyBindings;
  }

  onKeyPress(event) {
    let state = event.type === "keydown" ? true : false;
    let key = this._keyBindings.find((k) => k.keys.includes(event.key));
    if (key) this._keysDown[key.action].setState(state);
  }

  isKeyDown(action) {
    return this._queue == action || this._keysDown[action].active;
  }

  setQueue(action) {
    this._queue = action;
  }

  clearQueue() {
    this._queue = null;
  }
}

Controller.Input = class {
  constructor() {
    this.active = false;
  }
  /**
   * @param {Boolean} state - New key state
   */
  setState(state) {
    this.active = state;
  }
};
