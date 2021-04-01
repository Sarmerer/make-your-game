class Controller {
  constructor() {
    this._keyBindings = [
      { action: "left", triggers: ["ArrowLeft", "a"] },
      { action: "right", triggers: ["ArrowRight", "d"] },
      { action: "up", triggers: ["ArrowUp", "w"] },
      { action: "down", triggers: ["ArrowDown", "s"] },
    ];

    this._keyBindings.forEach((key) => {
      this[key.action] = new Controller.Input();
    });
  }

  get bindings() {
    return this._keyBindings;
  }

  onKeyPress(event) {
    let state = event.type === "keydown" ? true : false;
    let key = this._keyBindings.find((k) => k.triggers.includes(event.key));
    if (key) this[key.action].setState(state);
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
