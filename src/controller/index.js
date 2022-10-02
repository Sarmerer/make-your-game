import { keyBindings, keySequences } from "../settings.js";
import { getKey } from "./keycodes.js";

export class Controller {
  constructor() {
    this._keyBindings = keyBindings;

    this._keysDown = {};
    this._queue = null;
    this._history = new Controller.History(10);

    this._keyBindings.forEach((key) => {
      this._keysDown[key.action] = new Controller.Input();
    });

    this._listeners = {};
  }

  on(eventName, callback) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }

    this._listeners[eventName].push(callback);
  }
  off(eventName, callback) {
    if (!this._listeners[eventName]) return;

    this._listeners[eventName].splice(
      this._listeners[eventName].indexOf(callback),
      1
    );
  }
  dispatch(eventName, data) {
    if (!this._listeners[eventName]) return;

    this._listeners[eventName].forEach((callback) => {
      callback(data);
    });
  }

  get bindings() {
    return this._keyBindings;
  }

  onKeyPress(event) {
    const keydown = event.type === "keydown" ? true : false;
    const keyCodeValue = getKey(event.keyCode);
    if (!keyCodeValue) return;

    const key = this._keyBindings.find((k) => k.keys.includes(keyCodeValue));

    if (keydown) {
      this._history.push(keyCodeValue);
      for (const seq of keySequences) {
        if (this._history.match(seq.sequence)) {
          this.dispatch(seq.event);
        }
      }
    }

    if (key) this._keysDown[key.action].setState(keydown);
  }

  isKeyDown(action) {
    if (this._queue == action) {
      this.clearQueue();
      return true;
    }

    return this._keysDown[action].active;
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

Controller.History = class {
  constructor(maxLength) {
    this._history = [];
    this._index = 0;
    this._maxLength = maxLength || 10;
  }

  push(action) {
    this._history.push(action);
    if (this._history.length > this._maxLength) {
      this._history.shift();
    }
    this._index = this._history.length - 1;
  }

  slice(start, end) {
    return this._history.slice(start, end);
  }

  match(seq) {
    if (seq.length > this._history.length) return false;

    const history = this.slice(-seq.length);
    for (let i = 0; i < seq.length; i++) {
      if (seq[i] !== history[i]) return false;
    }
    return true;
  }
};
