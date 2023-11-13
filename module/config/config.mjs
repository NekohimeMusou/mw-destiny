export const MWDESTINY = {
  attributes: Object.fromEntries(
      ["str", "rfl", "int", "wil", "cha", "edg"]
          .map((a) => [a, a.toUpperCase()])),
  rollDifficulties: Object.fromEntries(
      ["easy", "average", "hard"]
          .map((d) => [d, `MWDESTINY.dialog.difficulty.${d}`])),
  rollDifficultyDice: {
    easy: "2d6",
    average: "3d6",
    hard: "4d6",
  },
  damageTypes: Object.fromEntries(
      ["ballistic", "energy"]
          .map((s) => [s, `MWDESTINY.combat.damageTypes.${s}`])),
  weaponRanges: Object.fromEntries(
      ["close", "near", "far"]
          .map((r) => [r, `MWDESTINY.combat.range.${r}`]),
  ),
  weaponSkillTypes: Object.fromEntries(
      ["melee", "projectile", "smallArms"]
          .map((s) => [s, `MWDESTINY.combat.skills.${s}`]),
  ),
};
