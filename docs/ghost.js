class Ghost extends Entity {
  constructor(x = 90, y = 90, id = "ghost", color = "red") {
    super(x, y);
    this._speed = 2;
    this._lastDirection = null;
    this._div = NewHTMLElement("div", {
      id: id,
      style: {
        width: `${this._width}px`,
        height: `${this._height}px`,
        position: "absolute",
        backgroundColor: color,
        zIndex: 999,
      },
    });

    this._animation = new Image(30, 30);
    this._animation.src = "./assets/pacman.png";
    this._div.appendChild(this._animation);
  }

  move(directions) {
    if (directions.left > 1 && directions.includes(this._lastDirection))
      directions.splice(directions.indexOf(this._lastDirection), 1);
    const d = Math.floor(Math.random() * directions.length);
    this._lastDirection = directions[d];
    this._div.className = `walk-${directions[d]}`;
    switch (directions[d]) {
      case "left":
        this._xVel = -this._speed;
        this._yVel = 0;
        break;
      case "right":
        this._xVel = this._speed;
        this._yVel = 0;
        break;
      case "up":
        this._xVel = 0;
        this._yVel = -this._speed;
        break;
      case "down":
        this._xVel = 0;
        this._yVel = this._speed;
        break;
      default:
        break;
    }
  }

  get div() {
    return this._div;
  }
}
