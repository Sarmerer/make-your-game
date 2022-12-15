export const keyBindings = [
  { action: "left", keys: ["arrowleft", "a"] },
  { action: "right", keys: ["arrowright", "d"] },
  { action: "up", keys: ["arrowup", "w"] },
  { action: "down", keys: ["arrowdown", "s"] },
];

export const events = {
  toggleOnePunchMode: "toggleOnePunchMode",
  toggleDebugMode: "toggleDebugMode",
  toggleNoChase: "toggleNoChaseMode",
  iddqd: "toggleGodMode",

  konamiCode: "extraLives",
  suicide: "suicide",
  heal: "heal",
  rollMe: "rollMe",
};

export const settings = {
  gamePaused: false,
  debugMode: true,
  godMode: false,
  onePunchMode: false,
  noChaseMode: false,
  freezeGhosts: false,
};

export function changeSetting(settingName, value) {
  if (settings.hasOwnProperty(settingName)) {
    settings[settingName] = value;
  }
}

export function toggleSetting(settingName) {
  changeSetting(settingName, !settings[settingName]);
}

export const keySequences = [
  {
    name: "DEBUG",
    event: events.toggleDebugMode,
    sequence: ["d", "e", "b", "u", "g"],
  },
  {
    name: "NEEDSOMEHEALTH",
    event: events.konamiCode,
    sequence: [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
    ],
  },
  {
    name: "IAMALIVE",
    event: events.iddqd,
    sequence: ["i", "d", "d", "q", "d"],
  },
  {
    name: "INEEDSOMEHELP",
    event: events.heal,
    sequence: ["h", "e", "s", "o", "y", "a", "m"],
  },
  {
    name: "GOODBYECRUELWORLD",
    event: events.suicide,
    sequence: ["p", "l", "z", "h", "e", "l", "p"],
  },
  {
    name: "STINGLIKEABEE",
    event: events.toggleOnePunchMode,
    sequence: ["t", "h", "e", "b", "o", "l", "d", "g", "u", "y"],
  },
  {
    name: "TURNDOWNTHEHEAT",
    event: events.toggleNoChase,
    sequence: ["c", "h", "i", "l", "l"],
  },
  {
    name: "NEVERGONNAGIVEYOUUP",
    event: events.rollMe,
    sequence: ["r", "o", "l", "l", "m", "e"],
  },
];
