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
  playerWeaponSkillTypes: Object.fromEntries(
      ["melee", "projectile", "smallArms", "gunneryMech", "gunneryAerospace", "gunneryVehicle", "support", "artillery"]
          .map((s) => [s, `MWDESTINY.skills.weapon.${s}`]),
  ),
  weaponSkillTypes: Object.fromEntries(
      ["melee", "projectile", "smallArms", "gunnery", "support", "artillery"]
          .map((s) => [s, `MWDESTINY.skills.weapon.${s}`]),
  ),
  weaponSkillLinks: {
    support: "str",
    artillery: "int",
    melee: "rfl",
    projectile: "rfl",
    smallArms: "rfl",
    gunneryMech: "rfl",
    gunneryAerospace: "rfl",
    gunneryVehicle: "rfl",
  },
  pilotingSkillTypes: Object.fromEntries(
      ["mech", "aerospace", "combatVehicle"]
          .map((s) => [s, `MWDESTINY.skills.piloting.${s}`]),
  ),
  hardwareTypes: Object.fromEntries(
      ["mech", "aerospace", "combatVehicle", "turretVehicle", "vtol", "vehicle", "battleArmor"]
          .map((s) => [s, `MWDESTINY.hardware.types.${s}`]),
  ),
  hitLocations: {
    mech: ["head", "torso", "armLeft", "armRight", "legLeft", "legRight"],
    aerospace: ["nose", "wingRight", "wingLeft", "aft", "structuralIntegrity"],
    turretVehicle: ["front", "turret", "sideRight", "sideLeft", "rear"],
    combatVehicle: ["front", "sideRight", "sideLeft", "rear"],
    vtol: ["front", "rotor", "sideRight", "sideLeft", "rear"],
    vehicle: ["durability", "front", "sideRight", "sideLeft", "rear"],
    battleArmor: ["armor"],
  },
  physAttackInfo: {
    punch: "Req: No arm Weapon Groups fired.\nLoc: 2d6: Treat any leg hit as a hit to the corresponding arm instead.",
    kick: "Req: Attacker must be standing.\n1d6: 1-3, Right Leg; 4-6, Left Leg ('Mech); 2d6 (other ground units)",
  },
};
