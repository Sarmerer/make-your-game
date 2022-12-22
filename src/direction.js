export class Direction {
  static UP = 1;
  static RIGHT = 2;
  static DOWN = 3;
  static LEFT = 4;

  static OPPOSITE = {
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.UP]: Direction.DOWN,
    [Direction.RIGHT]: Direction.LEFT,
  };

  static NEXT = {
    [Direction.UP]: Direction.LEFT,
    [Direction.LEFT]: Direction.DOWN,
    [Direction.DOWN]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.UP,
  };

  static VELOCITY = {
    [Direction.UP]: { x: 0, y: -1 },
    [Direction.RIGHT]: { x: 1, y: 0 },
    [Direction.DOWN]: { x: 0, y: 1 },
    [Direction.LEFT]: { x: -1, y: 0 },
  };

  static STRING = {
    [Direction.UP]: "up",
    [Direction.RIGHT]: "right",
    [Direction.DOWN]: "down",
    [Direction.LEFT]: "left",
  };

  constructor(direction) {
    this.direction = null;
    this.x = 0;
    this.y = 0;
    this.change(direction);
  }

  change(direction) {
    if (direction instanceof Direction) {
      direction = direction.direction;
    }

    this.direction = direction;
    let vel = { x: 0, y: 0 };
    if (!this.isNone()) {
      vel = Direction.VELOCITY[direction];
    }

    this.x = vel.x;
    this.y = vel.y;
  }

  equalsTo(direction) {
    return this.direction == direction.direction;
  }

  isAvailableWithin(availableDirections) {
    for (const a of availableDirections) {
      if (this.equalsTo(a)) return true;
    }

    return false;
  }

  toString() {
    return Direction.STRING[this.direction];
  }

  opposite() {
    return Direction.OPPOSITE[this.direction];
  }

  next() {
    return Direction.OPPOSITE[this.direction];
  }

  toOpposite() {
    return new Direction(this.opposite());
  }

  toNext() {
    return new Direction(this.next());
  }

  isNone() {
    return this.direction == null;
  }

  isUp() {
    return this.direction == Direction.UP;
  }

  isRight() {
    return this.direction == Direction.RIGHT;
  }

  isDown() {
    return this.direction == Direction.DOWN;
  }

  isLeft() {
    return this.direction == Direction.LEFT;
  }

  static Up() {
    return new Direction(Direction.UP);
  }

  static Right() {
    return new Direction(Direction.RIGHT);
  }

  static Down() {
    return new Direction(Direction.DOWN);
  }

  static Left() {
    return new Direction(Direction.LEFT);
  }
}
