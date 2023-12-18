export const MWDESTINY = {
  attributes: {
    pc: Object.fromEntries(
        ["str", "rfl", "int", "wil", "cha", "edg"]
            .map((a) => [a, a.toUpperCase()])),
    npc: Object.fromEntries(
        ["str", "rfl", "int", "wil", "cha"]
            .map((a) => [a, a.toUpperCase()])),
    animal: Object.fromEntries(
        ["str", "rfl", "int", "wil"]
            .map((a) => [a, a.toUpperCase()])),
  },
  lifeModuleStages: ["faction", "childhood", "higherEd", "realLife"],
  rollDifficulties: Object.fromEntries(
      ["easy", "average", "hard"]
          .map((d) => [d, `MWDESTINY.dialog.difficulties.${d}`])),
  rollDifficultyDice: {
    easy: "2d6",
    average: "3d6",
    hard: "4d6",
  },
  damageTypes: {
    weapon: Object.fromEntries(
        ["ballistic", "energy"]
            .map((s) => [s, `MWDESTINY.damageType.personal.${s}`])),
    heavyWeapon: Object.fromEntries(
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
            .map((r) => [r, `MWDESTINY.range.heavy.${r}`]),
    ),
  },
  weaponSkillTypes: Object.fromEntries(
      ["melee", "projectile", "smallArms", "gunneryMech", "gunneryAero", "gunneryVehicle", "support", "artillery"]
          .map((s) => [s, `MWDESTINY.skills.weapon.${s}`]),
  ),
  weaponSkillLinks: {
    support: "str",
    artillery: "int",
    melee: "rfl",
    projectile: "rfl",
    smallArms: "rfl",
    gunneryMech: "rfl",
    gunneryAero: "rfl",
    gunneryVehicle: "rfl",
  },
  pilotingSkillTypes: Object.fromEntries(
      ["mech", "aerospace", "combatVehicle"]
          .map((s) => [s, `MWDESTINY.skills.piloting.${s}`]),
  ),
  hardwareTypes: Object.fromEntries(
      ["mech", "aerospace", "combatVehicle", "vtol", "vehicle", "battleArmor"]
          .map((s) => [s, `MWDESTINY.hardware.types.${s}`]),
  ),
  hitLocations: {
    mech: ["head", "torso", "armLeft", "armRight", "legLeft", "legRight"],
    aerospace: ["nose", "aft", "wingRight", "wingLeft", "structuralIntegrity"],
    combatVehicle: ["front", "rear", "sideRight", "sideLeft", "turret"],
    vtol: ["front", "rear", "sideRight", "sideLeft", "rotor"],
    vehicle: ["durability", "front", "rear", "sideRight", "sideLeft"],
    battleArmor: ["armor"],
  },
};
