const keyBindings = [
  { action: "left", triggers: ["ArrowLeft", "a"] },
  { action: "right", triggers: ["ArrowRight", "d"] },
  { action: "up", triggers: ["ArrowUp", "w", " "] },
  { action: "die", triggers: ["f"] },
];

class Controller {
  constructor() {
    keyBindings.forEach((key) => {
      this[key.action] = new Controller.Input();
    });
  }

  onKeyPress(event) {
    let state = event.type === "keydown" ? true : false;
    let key = keyBindings.find((k) => k.triggers.includes(event.key));
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
