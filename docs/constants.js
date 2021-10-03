export const PLAYER_SPEED = 1.5;
export const GHOST_SPEED = 1.25;

export const BLOCK_WIDTH = 30;
export const BLOCK_HEIGHT = 30;

export const SHOW_GHOSTS_TARGET_TILES = false;

export const DIRECTIONS = {
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4,
};

export const DIRECTION_TO_VECTOR = {
  [DIRECTIONS.UP]: { x: 0, y: -1 },
  [DIRECTIONS.RIGHT]: { x: 1, y: 0 },
  [DIRECTIONS.DOWN]: { x: 0, y: 1 },
  [DIRECTIONS.LEFT]: { x: -1, y: 0 },
};

export const DIRECTION_TO_STRING = {
  [DIRECTIONS.UP]: "up",
  [DIRECTIONS.RIGHT]: "right",
  [DIRECTIONS.DOWN]: "down",
  [DIRECTIONS.LEFT]: "left",
};

export function directionToString(direction) {
  return DIRECTION_TO_STRING[direction] ?? "";
}

export function directionToVector(direction) {
  return DIRECTION_TO_VECTOR[direction] ?? { x: 1, y: 1 };
}

export function validDirection(direction) {
  return typeof direction === "number"
    ? direction > 0 && direction <= 4
    : DIRECTIONS[direction] !== undefined;
}
