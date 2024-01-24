export const MWDESTINY = {};

const animalAttributes = ["str", "rfl", "int", "wil"];
const npcAttributes = animalAttributes.concat(["cha"]);
const pcAttributes = npcAttributes.concat(["edg"]);

MWDESTINY.attributes = {
  pc: Object.fromEntries(
      pcAttributes.map((a) => [a, a.toUpperCase()])),
  npc: Object.fromEntries(
      npcAttributes.map((a) => [a, a.toUpperCase()])),
  animal: Object.fromEntries(
      animalAttributes.map((a) => [a, a.toUpperCase()])),
};

MWDESTINY.lifeModuleStages = ["faction", "childhood", "higherEd", "realLife"];

MWDESTINY.rollDifficultyDice = {
  easy: "2d6",
  average: "3d6",
  hard: "4d6",
};

MWDESTINY.rollDifficulties = Object.values(MWDESTINY.rollDifficultyDice).map((d) => [d, `MWDESTINY.dialog.difficulties.${d}`]);

const personalDamageTypes = ["ballistic", "energy"];
const heavyDamageTypes = personalDamageTypes.concat(["missile"]);

MWDESTINY.damageTypes = {
  weapon: Object.fromEntries(
      personalDamageTypes.map((s) => [s, `MWDESTINY.damageType.personal.${s}`]),
  ),
  heavyWeapon: Object.fromEntries(
      heavyDamageTypes.map((s) => [s, `MWDESTINY.damageType.heavy.${s}`]),
  ),
};

const personalWeaponRanges = ["close", "near", "far"];
const heavyWeaponRanges = ["pointblank", "short", "medium", "long"];

MWDESTINY.weaponRange = {
  personal: Object.fromEntries(
      personalWeaponRanges.map((r) => [r, `MWDESTINY.range.personal.${r}`]),
  ),
  heavy: Object.fromEntries(
      heavyWeaponRanges.map((r) => [r, `MWDESTINY.range.heavy.${r}`]),
  ),
};

MWDESTINY.playerWeaponSkillTypes = Object.fromEntries(
    ["support", "artillery", "melee", "projectile", "smallArms", "piloting", "gunneryMech", "gunneryAerospace", "gunneryVehicle"]
        .map((s) => [s, `MWDESTINY.skills.weapon.${s}`]),
);

MWDESTINY.weaponSkillTypes = Object.fromEntries(
    ["melee", "projectile", "smallArms", "piloting", "gunnery", "support", "artillery"]
        .map((s) => [s, `MWDESTINY.skills.weapon.${s}`]),
);

MWDESTINY.weaponSkillLinks = {
  support: "str",
  artillery: "int",
  melee: "rfl",
  projectile: "rfl",
  smallArms: "rfl",
  piloting: "rfl",
  gunneryMech: "rfl",
  gunneryAerospace: "rfl",
  gunneryVehicle: "rfl",
  gunnery: "rfl",
};

MWDESTINY.pilotingSkillTypes = Object.fromEntries(
    ["mech", "aerospace", "combatVehicle"]
        .map((s) => [s, `MWDESTINY.skills.piloting.${s}`]),
);

MWDESTINY.hardwareTypes = Object.fromEntries(
    ["mech", "aerospace", "combatVehicle", "turretVehicle", "vtol", "vehicle", "battleArmor"]
        .map((s) => [s, `MWDESTINY.hardware.types.${s}`]),
);

MWDESTINY.hitLocations = {
  mech: ["head", "torso", "armLeft", "armRight", "legLeft", "legRight"],
  aerospace: ["nose", "wingRight", "wingLeft", "aft", "structuralIntegrity"],
  turretVehicle: ["front", "turret", "sideRight", "sideLeft", "rear"],
  combatVehicle: ["front", "sideRight", "sideLeft", "rear"],
  vtol: ["front", "rotor", "sideRight", "sideLeft", "rear"],
  vehicle: ["durability", "front", "sideRight", "sideLeft", "rear"],
  battleArmor: ["armor"],
};

MWDESTINY.physAttackInfo = {
  punch: "Req: No arm Weapon Groups fired.\nLoc: 2d6: Treat any leg hit as a hit to the corresponding arm instead.",
  kick: "Req: Attacker must be standing.\n1d6: 1-3, Right Leg; 4-6, Left Leg ('Mech); 2d6 (other ground units)",
};

MWDESTINY.xpLevels = Object.fromEntries(["green", "regular", "veteran", "elite"]
    .map((lv) => [lv, `MWDESTINY.xpLevels.${lv}`]));

const iconPath = "systems/mw-destiny/assets/img/icon";
const {ADD, OVERRIDE} = CONST.ACTIVE_EFFECT_MODES;

MWDESTINY.statusEffects = [
  {
    id: "overheating",
    name: "MWDESTINY.status.overheating",
    icon: `${iconPath}/overheating.svg`,
  },
  {
    id: "jumpJetsActive",
    name: "MWDESTINY.status.jumpJetsActive",
    icon: `${iconPath}/jumpJets.svg`,
    changes: [
      {
        key: "system.jumpJetMod",
        value: 1,
        mode: OVERRIDE,
      },
    ],
  },
  {
    id: "mascActive",
    name: "MWDESTINY.status.mascActive",
    icon: `${iconPath}/masc.svg`,
    changes: [
      {
        key: "system.movement",
        value: 1,
        mode: ADD,
      },
    ],
  },
  {
    id: "engineCrit",
    name: "MWDESTINY.status.engineCrit",
    icon: `${iconPath}/engineCrit.svg`,
    changes: [
      {
        key: "system.engineCrit",
        value: true,
        mode: OVERRIDE,
      },
    ],
  },
  {
    id: "shutdown",
    name: "MWDESTINY.status.shutdown",
    icon: `${iconPath}/shutdown.svg`,
    changes: [
      {
        key: "system.isShutDown",
        value: true,
        mode: OVERRIDE,
      },
      {
        key: "system.movement",
        value: 0,
        mode: OVERRIDE,
      },
    ],
  },
];
