export async function rollCritEffect() {
  if (game.user.targets.size < 1) {
    return await ui.notifications.warn(game.i18n.localize("MWDESTINY.notifications.noTarget"));
  }

  const chatCards = [];

  for (const target of game.user.targets) {
    const hardwareType = target.actor.system?.hardwareType;

    if (!hardwareType) {
      continue;
    }

    const isAerospace = hardwareType === "aerospace";

    const {critLocation: hitLocation, cancelled} = isAerospace ? null : showCritLocationDialog(hardwareType);

    if (cancelled) {
      return;
    }

    // Roll for crit chance
    const critChanceRoll = await new Roll("2d6").roll({async: true});
    // If successful, roll for crit effect
    const success = critChanceRoll.total >= 8;
    const successLoc = success ? "critCheckSuccess" : "critCheckFailure";
    const successMsg = game.i18n.localize(`MWDESTINY.sheet.${successLoc}`);

    const parts = [
      `<p>${game.i18n.localize("MWDESTINY.sheet.criticalHitCheck")}</p>`,
      critChanceRoll.render(),
      `<p>${successMsg}</p>`,
    ];

    const rolls = [critChanceRoll];

    if (success) {
      const formula = isAerospace ? "2d6" : "1d6";
      const critEffectRoll = await new Roll(formula).roll({async: true});

      const critEffect = getCritEffect(hardwareType, hitLocation, critEffectRoll.total);

      if (!critEffect.endsWith("none")) {
        parts.push(critEffectRoll.render());
        rolls.push(critEffectRoll);
      }

      parts.push(`<p>${game.i18n.localize(critEffect)}</p>`);
    }

    const content = `div class="flexcol">\n${parts.join("\n")}\n</div>`;

    chatCards.push({
      user: game.user.id,
      rolls,
      content,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      flavor: game.i18n.localize("MWDESTINY.sheet.criticalHitCheck"),
    });
  }

  for (const chatData of chatCards) {
    await ChatMessage.create(chatData);
  }
}

async function showCritLocationDialog(hardwareType) {
  if (!Object.keys(CONFIG.MWDESTINY.critLocations).includes(hardwareType)) {
    return null;
  }

  const template = "systems/mw-destiny/templates/dialog/crit-check-dialog.hbs";
  const content = await renderTemplate(template, {locations: CONFIG.MWDESTINY.critLocations[hardwareType]});

  return new Promise((resolve) => new Dialog({
    title: game.i18n.localize("MWDESTINY.sheet.criticalHitCheck"),
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

async function _processRollOptions(form) {
  return {hitLocation: form.hitLocation.value};
}

// Returns localizable string
function getCritEffect(hardwareType, hitLocation, rollTotal) {
  switch (hardwareType) {
    case "mech":
      return getMechCritEffect(hitLocation, rollTotal);
    case "combatVehicle":
    case "vtol":
      return getCombatVehicleCritEffect(hitLocation, rollTotal);
    case "aerospace":
      return getAeroCritEffect(rollTotal);
  }

  return "";
}

function getMechCritEffect(hitLocation, rollTotal) {
  let critEffect = "";

  switch (hitLocation) {
    case "torso":
      switch (rollTotal) {
        case 1:
          critEffect = "ammoExplosion";
          break;
        case 2:
          critEffect = "weaponGroupDestroyed";
          break;
        case 3:
        case 4:
          critEffect = "gyroDamaged";
          break;
        case 5:
        case 6:
          critEffect = "engineShieldingDamaged";
          break;
      }
      break;
    case "arm":
      if (rollTotal <= 1) {
        critEffect = "ammoExplosion";
      } else {
        critEffect = "weaponGroupDestroyed";
      }
      break;
    case "leg":
      if (rollTotal <= 1) {
        critEffect = "ammoExplosion";
      } else {
        critEffect = "actuatorDamage";
      }
      break;
    case "head":
      critEffect = "headHit";
  }

  return `MWDESTINY.critLocations.mech.${hitLocation}.${critEffect}`;
}

function getCombatVehicleCritEffect(hitLocation, rollTotal) {
  let critEffect = "";

  switch (hitLocation) {
    case "front":
      if (rollTotal === 1) {
        critEffect = "crewCompartmentHit";
      } else if (rollTotal === 2) {
        critEffect = "crewStunned";
      } else {
        critEffect = "weaponGroupDestroyed";
      }
      break;
    case "turret":
      if (rollTotal === 1) {
        critEffect = "crewCompartmentHit";
      } else if (rollTotal === 2) {
        critEffect = "crewStunned";
      } else {
        critEffect = "weaponGroupDestroyed";
      }
      break;
    case "rotor":
      critEffect = "none";
      break;
    case "rear":
      if (rollTotal <= 2) {
        critEffect = "ammoExplosion";
      } else {
        critEffect = "motiveDamage1";
      }
      break;
    case "side":
      critEffect = "motiveDamage2";
      break;
  }

  return `MWDESTINY.critLocations.combatVehicle.${hitLocation}.${critEffect}`;
}

function getAeroCritEffect(rollTotal) {
  let critEffect = "";

  switch (rollTotal) {
    case 2:
      critEffect = "noseWeaponGroupDestroyed";
      break;
    case 3:
      critEffect = "avionicsDamage";
      break;
    case 4:
      critEffect = "fuelTankHit";
      break;
    case 5:
    case 6:
      critEffect = "wingRightWeaponGroupDestroyed";
      break;
    case 7:
      critEffect = "engineShieldingDamaged";
      break;
    case 8:
    case 9:
      critEffect = "wingLeftWeaponGroupDestroyed";
      break;
    case 10:
      critEffect = "ammoExplosion";
      break;
    case 11:
      critEffect = "bombDamage";
      break;
    case 12:
      critEffect = "cockpitHit";
      break;
  }

  return `MWDESTINY.critLocations.aerospace.${critEffect}`;
}
