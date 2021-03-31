class Ghost {
  constructor() {}
}

class Player {
  constructor(x = 100, y = 100) {
    this._x = x;
    this._y = y;
    this._xv = 0;
    this._yv = 0;
    this._queue = null;
    this._lastDirection = null;
    this._lastMove = null;
    this._div = NewHTMLElement("div", {
      id: "player",
      style: {
        width: "50px",
        height: "50px",
        position: "absolute",
        backgroundColor: "white",
        zIndex: 999,
      },
    });
  }

  goUp() {
    if (this._x % 50) return (this._queue = this.goUp);
    this._yv = -5;
    this._xv = 0;
    this._queue = null;
  }
  goDown() {
    if (this._x % 50) return (this._queue = this.goDown);
    this._yv = 5;
    this._xv = 0;
    this._queue = null;
  }
  goLeft() {
    if (this._y % 50) return (this._queue = this.goLeft);
    this._yv = 0;
    this._xv = -5;
    this._queue = null;
  }
  goRight() {
    if (this._y % 50) return (this._queue = this.goRight);
    this._yv = 0;
    this._xv = 5;
    this._queue = null;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get xv() {
    return this._xv || 0;
  }
  get yv() {
    return this._yv || 0;
  }
  get div() {
    return this._div;
  }
  get lastDirection() {
    return this._lastDirection;
  }
  get lastMove() {
    return this._lastMove;
  }
  get queue() {
    return this._queue;
  }

  set x(value) {
    this._x = value;
  }
  set y(value) {
    this._y = value;
  }
  set xv(value) {
    this._xv = value;
  }
  set yv(value) {
    this._yv = value;
  }
  set lastDirection(value) {
    if (typeof value !== "string") return;
    this._lastDirection = value;
  }
  set lastMove(value) {
    this._lastMove = value;
  }
}

class World {
  constructor() {
    this._map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
  }

  get map() {
    return this._map;
  }
}

class Game {
  constructor() {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
      canvas = document.createElement("div");
      canvas.id = "canvas";
      document.body.appendChild(div);
    }
    this._canvas = canvas;
    this._world = new World();
    this._player = new Player();
    this._canvas.appendChild(this._player.div);
  }

  update() {
    if (this._player.queue) this._player.queue();
    this._player.x += this._player.xv;
    this._player.y += this._player.yv;
    this.drawPlayer();
    this.checkCollision();
  }

  checkCollision() {
    if (this._player.x < 50) {
      this._player.x = 50;
      this._player.xv = 0;
    }
    if (this._player.y < 50) {
      this._player.y = 50;
      this._player.yv = 0;
    }
    if (this._player.x > 350) {
      this._player.x = 350;
      this._player.xv = 0;
    }
    if (this._player.y > 400) {
      this._player.y = 400;
      this._player.yv = 0;
    }
  }

  draw() {
    this.drawMap();
    this.drawPlayer();
  }

  drawMap() {
    for (let i = 0; i < this._world.map.length; i++) {
      const row = this._world.map[i];
      for (let j = 0; j < row.length; j++) {
        const cell = this._world.map[i][j];
        let div = NewHTMLElement("div", {
          style: {
            width: "50px",
            height: "50px",
            backgroundColor: cell ? "green" : "blue",
            position: " absolute",
            top: `${50 * i}px`,
            left: `${50 * j}px`,
          },
        });
        this._canvas.appendChild(div);
      }
    }
  }

  drawPlayer() {
    this._player.div.style.top = `${this._player.y}px`;
    this._player.div.style.left = `${this._player.x}px`;
  }

  get player() {
    return this._player;
  }

  get world() {
    return this._world;
  }
}

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
