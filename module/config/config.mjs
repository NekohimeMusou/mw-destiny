export const MWDESTINY = {
  attributes: Object.fromEntries(
      ["str", "rfl", "int", "wil", "cha", "edg"]
          .map((a) => [a, a.toUpperCase()])),
  rollDifficulties: {
    opposed: "MWDESTINY.dialog.difficulty.opposed",
    easy: "MWDESTINY.dialog.difficulty.easy",
    average: "MWDESTINY.dialog.difficulty.average",
    hard: "MWDESTINY.dialog.difficulty.hard",
  },
};
