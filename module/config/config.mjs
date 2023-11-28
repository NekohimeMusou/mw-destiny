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
  damageTypes: {
    personal: Object.fromEntries(
        ["ballistic", "energy"]
            .map((s) => [s, `MWDESTINY.damageType.personal.${s}`])),
    heavy: Object.fromEntries(
        ["ballistic", "energy", "missile"]
            .map((s) => [s, `MWDESTINY.damageType.heavy.${s}`])),
  },
  weaponRange: {
    personal: Object.fromEntries(
        ["close", "near", "far"]
            .map((r) => [r, `MWDESTINY.range.personal.${r}`]),
    ),
    heavy: Object.fromEntries(
        ["pointblank", "short", "medium", "long"]
            .map((r) => [r, `MWDESTINY.combat.range.${r}`]),
    ),
  },
  weaponSkillTypes: Object.fromEntries(
      ["melee", "projectile", "smallArms", "gunnery", "support", "artillery"]
          .map((s) => [s, `MWDESTINY.combat.skills.${s}`]),
  ),
};
