export async function rollTest(rollData, title, {actor=null, attr=null,
  skillRank=null, skillName=null, damageCode=null, woundPenalty=0,
  targetDefLabel="", targetDefMod=0, targetName=null, targetHwType=null,
  scaleMod=0, speedMod=0, baseDamage=0, missileCount=0, missileMax=0,
  cluster=0, special="", weaponHeat=0, jumpJetMod=0, rangedHeatMod=0,
  range=null, weaponType=null}={}) {
  if (range && weaponType) {
    const rangeType = weaponType === "weapon" ? "personal" : "heavy";

    range = Object.fromEntries(Object.entries(range).filter(([_, data]) => data.usable)
        .map(([r, data]) => [data.mod, `MWDESTINY.range.${rangeType}.${r}`]));
  }

  const {mod, difficulty, term2, attr2, rangeMod, cancelled} = await showRollDialog(title,
      {attr, skillRank, skillName, targetName, range, weaponType});

  if (cancelled) return;

  if (actor?.type === "hardware") {
    const heatBuildup = actor.system?.heatBuildup || 0;
    await actor.update({"system.heatBuildup": heatBuildup + weaponHeat});
  }

  // HACK: Filter out 0s and undefineds.
  // I should have done this in a more robust way from the start, but
  // the number of zeroes in the rolls is getting crazy
  const modList = [woundPenalty, scaleMod, speedMod, jumpJetMod, rangedHeatMod, rangeMod, mod];

  const mods = modList.filter((n) => n).map((n) => ` + ${n}`).join("");

  const rollFormula = `2d6 + @${attr} + ${term2}${mods}`;

  const playerRoll = await new Roll(rollFormula, rollData).roll({async: true});

  // If difficulty is null, return the roll by itself
  // If not, roll the difficulty dice
  const rolls = [playerRoll];

  const parts = [];

  const flavor = (skillName || damageCode) ? title :
   game.i18n.format("MWDESTINY.mechanic.test", {name: `${attr?.toUpperCase()} + ${attr2?.toUpperCase() || game.i18n.localize("MWDESTINY.skills.unskilled")}`});

  parts.push(`<p>${attr.toUpperCase()} + ${skillName || attr2?.toUpperCase() || game.i18n.localize("MWDESTINY.skills.unskilled")}</p>`);

  if (targetName) {
    parts.push(`<h3>${game.i18n.format("MWDESTINY.mechanic.target", {name: targetName})}</h3>`);
  }

  const missileHtml = [];

  if (difficulty || damageCode) {
    const difficultyDice = difficulty ? `${difficulty}` : `2d6 + ${targetDefMod}`;

    const difficultyRoll = await new Roll(difficultyDice, rollData).roll({async: true});

    const success = playerRoll.total >= difficultyRoll.total;

    const [damageGroups, totalDmg] = await getDamageGroups(baseDamage, {missileCount, missileMax, cluster});
    const damageMessages = [];

    if (damageCode && success) {
      if (damageGroups.length > 1) {
        const dmgGroupStr = game.i18n.localize("MWDESTINY.hardware.damageGroups");
        const totalStr = game.i18n.format("MWDESTINY.hardware.totalDamage", {damage: totalDmg});
        damageMessages.push(`<p>${dmgGroupStr} (${totalStr})</p>`);
      }

      const groupStrings = [];

      for (const [label, dmg] of damageGroups) {
        let damageStr = `<p>${dmg} (${game.i18n.localize(`MWDESTINY.hardware.damageGroup.${label}`)})</p>`;

        if ((dmg > 0 || label === "missile") && ["mech", "aerospace", "combatVehicle", "turretVehicle", "vtol", "vehicle"].includes(targetHwType)) {
          const hitLocRoll = (await new Roll("2d6").roll({async: true})).total;
          const hitLocString = await _getHitLocation(targetHwType, hitLocRoll);

          if (dmg > 0) {
            damageStr += `<p>${game.i18n.format("MWDESTINY.hardware.hitLocation", {loc: hitLocString, roll: hitLocRoll})}</p>`;
          }
        }

        groupStrings.push(damageStr);
      }

      damageMessages.push(...groupStrings);
    }

    const specialMsg = special ? `<p>${game.i18n.localize("MWDESTINY.combat.special")}: ${special}</p>` : "";

    const successStr = damageCode ? game.i18n.localize("MWDESTINY.dice.hit") : game.i18n.localize("MWDESTINY.dice.success");
    const failureStr = damageCode ? game.i18n.localize("MWDESTINY.dice.miss") : game.i18n.localize("MWDESTINY.dice.failure");
    const successMsg = `<h3>${success ? `${successStr}!` : `${failureStr}!`}</h3>`;

    const playerLabel = `<p>${actor.name}</p>`;

    const difficultyStr = game.i18n.localize("MWDESTINY.mechanic.difficulty");
    const difficultyLabel = game.i18n.localize(`MWDESTINY.dialog.difficulties.${difficulty}`);

    const oppositionLabel = targetName ? `<p>${targetName}${targetDefLabel}</p>` :
    `<p>${difficultyStr}: ${difficultyLabel}`;

    parts.push(specialMsg, successMsg, ...damageMessages, playerLabel,
        await playerRoll.render(), oppositionLabel, await difficultyRoll.render(), ...missileHtml);
  } else {
    parts.push(await playerRoll.render());
  }

  const content = `<div class="flexcol">\n${parts.join("\n")}\n</div>`;

  const speaker = ChatMessage.getSpeaker(actor?.type === "hardware" && actor?.system?.pilotToken ? {token: actor.system.pilotToken}: {actor});

  const chatData = {
    user: game.user.id,
    speaker,
    rolls,
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor,
  };

  return await ChatMessage.create(chatData);
}

export async function rollGenericCheck({tn=0, formula="2d6", flavor="Check",
  successMsg="Success!", failureMsg="Failure!", actor=null,
  token=null, create=true}={}) {
  const roll = await new Roll(formula).roll({async: true});
  const total = roll.total;

  const content = [
    `<p>${flavor}</p>`,
    await roll.render(),
    `<p>${total >= tn ? successMsg : failureMsg}</p>`,
  ].join("\n");

  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor, token}),
    rolls: [roll],
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor,
  };

  return create ? await ChatMessage.create(chatData) : chatData;
}

// Return the 2nd term directly: "0" or "@[stat]" or the skill ranks
async function showRollDialog(title, {attr=null, skillRank=null, skillName=null,
  targetName=null, range=null, weaponType=null}={}) {
  async function _processRollOptions(form) {
    // If skillRank is 0/empty AND attr2 is empty, it's an unskilled roll
    // If skillRank > 0, it's a skill roll: return the skill ranks as an int
    // If attr2 exists, it's an attribute roll; return "@[attr]"
    const attr2 = form.attr2?.value;
    const term2 = attr2 ? `@${attr2}` : `${parseInt(skillRank || 0)}`;
    return {
      mod: parseInt(form.mod.value || 0),
      difficulty: form.difficulty?.value,
      term2,
      attr2,
      rangeMod: parseInt(form.range || 0),
    };
  }

  const template = "systems/mw-destiny/templates/dialog/roll-dialog.hbs";
  const content = await renderTemplate(template, {title, attr, skillRank,
    skillName, targetName, range, weaponType, MWDESTINY: CONFIG.MWDESTINY});

  return new Promise((resolve) => new Dialog({
    title,
    content,
    buttons: {
      roll: {
        label: game.i18n.localize("MWDESTINY.dialog.rollButton"),
        callback: (html) => resolve(_processRollOptions(html[0].querySelector("form"))),
      },
      cancel: {
        label: game.i18n.localize("MWDESTINY.dialog.cancelButton"),
        callback: () => resolve({cancelled: true}),
      },
    },
    default: "roll",
    close: () => resolve({cancelled: true}),
  }, null).render(true));
}

// MISSILE
// Roll hit loc for base damage (i.e. one dmg group)
// Roll specified # of missile dice
// 1-3 = that much damage, 4-6 = 0 damage
// Add total missile die dmg to base dmg
// If total > max, reduce largest missile die by 1 until total = max

// CLUSTER
// Subtract X from standard damage value and assign hit loc as normal
// For groups with only 1 cluster weapon this will be 0 (i.e. "4 (C4)" for an LB-10X AC)
// e.g. a group with an ER Large Laser and an LB-10X AC is 8 (C4)
// So you'd roll (8 - 4) = 4 as a single damage group, then 4 groups of 1
async function getDamageGroups(baseDmg, {missileCount=0, missileMax=0, cluster=0}={}) {
  const damageGroups = [];
  const baseGroupDmg = baseDmg - cluster;
  if (baseGroupDmg > 0) {
    damageGroups.push(["base", baseGroupDmg]);
  }

  if (cluster > 0) {
    const clusterGroups = Array(cluster).fill(["cluster", 1]);
    damageGroups.push(...clusterGroups);
  }

  const missileRolls = [];
  for (let i = 0; i < missileCount; i++) {
    const roll = await new Roll("1d6").roll({async: true});
    missileRolls.push(roll.total > 3 ? 0 : roll.total);
  }

  if (missileCount > 0 && missileMax > baseDmg) {
    // Subtract total from max dmg; e.g. total 5 - max 4 = delta 1
    const overkill = missileRolls.reduce((total, m) => total + m, 0) - missileMax + baseDmg;

    for (let i = 0; i < overkill; i++) {
      const maxGroup = Math.max(...missileRolls);
      const index = missileRolls.indexOf(maxGroup);
      if (index >= 0) missileRolls[index]--;
    }

    const missileGroups = missileRolls.map((d) => ["missile", d]);
    damageGroups.push(...missileGroups);
  }

  const totalDmg = damageGroups.filter(([type, _]) => type !== "cluster").reduce((total, [_, dmg]) => total + dmg, 0) + cluster;

  return [damageGroups, totalDmg];
}

async function _getHitLocation(hwType, roll) {
  switch (hwType) {
    case "mech":
      return await _mechHitLoc(roll);
    case "aerospace":
      return await _aerospaceHitLoc(roll);
    case "turretVehicle":
      return await _turretVehicleHitLoc(roll);
    case "combatVehicle":
      return await _combatVehicleHitLoc(roll);
    case "vtol":
      return await _vtolHitLoc(roll);
    case "vehicle":
      return await _vehicleHitLoc(roll);
    default:
      return "";
  }
}

async function _mechHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
      return `${game.i18n.localize("MWDESTINY.hitLocation.mech.torso")} (Crit on 8+)`;
    case 3:
    case 4:
      hitLocation = "armRight";
      break;
    case 5:
      hitLocation = "legRight";
      break;
    case 6:
    case 7:
    case 8:
      hitLocation = "torso";
      break;
    case 9:
      hitLocation = "legLeft";
      break;
    case 10:
    case 11:
      hitLocation = "armLeft";
      break;
    case 12:
      return `${game.i18n.localize("MWDESTINY.hitLocation.mech.head")} (Spend Plot Point for full damage)`;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.mech.${hitLocation}`);
}

async function _aerospaceHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
    case 7:
    case 12:
      hitLocation = "nose";
      break;
    case 3:
    case 11:
      hitLocation = "aft";
      break;
    case 4:
    case 5:
    case 6:
      hitLocation = "wingRight";
      break;
    case 8:
    case 9:
    case 10:
      hitLocation = "wingLeft";
      break;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.aerospace.${hitLocation}`);
}

async function _turretVehicleHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
      return `${game.i18n.localize("MWDESTINY.hitLocation.turretVehicle.front")} Crit on 8+`;
    case 3:
      hitLocation = "rear";
      break;
    case 4:
    case 7:
      hitLocation = "front";
      break;
    case 5:
    case 6:
      hitLocation = "sideRight";
      break;
    case 8:
    case 9:
      hitLocation = "sideLeft";
      break;
    case 10:
    case 11:
      hitLocation = "turret";
      break;
    case 12:
      return `${game.i18n.localize("MWDESTINY.hitLocation.turretVehicle.turret")} (Crit on 8+)`;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.turretVehicle.${hitLocation}`);
}

async function _combatVehicleHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
    case 12:
      return `${game.i18n.localize("MWDESTINY.hitLocation.combatVehicle.front")} (Crit on 8+)`;
    case 3:
      hitLocation = "rear";
      break;
    case 4:
    case 7:
    case 10:
    case 11:
      hitLocation = "front";
      break;
    case 5:
    case 6:
      hitLocation = "sideRight";
      break;
    case 8:
    case 9:
      hitLocation = "sideLeft";
      break;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.combatVehicle.${hitLocation}`);
}

async function _vtolHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
      return `${game.i18n.localize("MWDESTINY.hitLocation.vtol.front")} (Crit on 8+)`;
    case 3:
      hitLocation = "rear";
      break;
    case 4:
    case 7:
      hitLocation = "front";
      break;
    case 5:
    case 6:
      hitLocation = "sideRight";
      break;
    case 8:
    case 9:
      hitLocation = "sideLeft";
      break;
    case 10:
    case 11:
      hitLocation = "rotor";
      break;
    case 12:
      return `${game.i18n.localize("MWDESTINY.hitLocation.vtol.rotor")} (Crit on 8+)`;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.vtol.${hitLocation}`);
}

async function _vehicleHitLoc(roll) {
  let hitLocation;

  switch (roll) {
    case 2:
    case 12:
      return `${game.i18n.localize("MWDESTINY.hitLocation.vehicle.front")} (Crit on 8+)`;
    case 3:
      hitLocation = "rear";
      break;
    case 4:
    case 7:
    case 10:
    case 11:
      hitLocation = "front";
      break;
    case 5:
    case 6:
      hitLocation = "sideRight";
      break;
    case 8:
    case 9:
      hitLocation = "sideLeft";
      break;
    default:
      return "";
  }

  return game.i18n.localize(`MWDESTINY.hitLocation.vehicle.${hitLocation}`);
}
