export const MWDESTINY = {
  attributes: Object.fromEntries(
      ["str", "rfl", "int", "wil", "cha", "edg"]
          .map((a) => [a, a.toUpperCase()])),
  rollDifficulties: {
    easy: "MWDESTINY.dialog.difficulty.easy",
    average: "MWDESTINY.dialog.difficulty.average",
    hard: "MWDESTINY.dialog.difficulty.hard",
  },
  rollDifficultyDice: {
    easy: "2d6",
    average: "3d6",
    hard: "4d6",
  },
  damageTypes: {
    other: "MWDESTINY.combat.damageTypes.other",
    ballistic: "MWDESTINY.combat.damageTypes.ballistic",
    energy: "MWDESTINY.combat.damageTypes.energy",
  },
  weaponRanges: {
    close: "MWDESTINY.combat.range.close",
    near: "MWDESTINY.combat.range.near",
    far: "MWDESTINY.combat.range.far",
  },
};
