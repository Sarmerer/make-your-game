class Controller {
  constructor() {
    this.left = new Controller.Input();
    this.right = new Controller.Input();
    this.up = new Controller.Input();

    this.keys = [
      { v: this.left, triggers: ["ArrowLeft", "a"] },
      { v: this.right, triggers: ["ArrowRight", "d"] },
      { v: this.up, triggers: ["ArrowUp", "w", " "] },
    ];
  }

  onKeyPress(event) {
    let state = event.type === "keydown" ? true : false;
    let key = this.keys.find((k) => k.triggers.includes(event.key));
    if (key) key.v.setState(state);
  }
}

Controller.Input = function () {
  this.active = false;
};

Controller.Input.prototype = {
  constructor: Controller.Input,

  /**
   * @param {Boolean} state - New state
   */
  setState: function (state) {
    this.active = state;
  },
};
