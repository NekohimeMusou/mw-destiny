export async function rollCriticalHit(hardwareType, hitLocation=null) {
  if (!["mech", "combatVehicle", "aerospace", "vtol"].contains(hardwareType)) {
    return await ui.notifications.warn("MWDESTINY.notifications.noCritLocations");
  }

  const parts = [`<p>${game.i18n.localize("MWDESTINY.sheet.criticalHitCheck")}</p>`];

  const checkRoll = await new Roll("2d6").roll({async: true});
  const success = checkRoll.total >= 8;
  const successMsg = game.i18n.localize(`MWDESTINY.sheet.${success ? "critCheckSuccess" : "critCheckFailure"}`);

  parts.push(checkRoll.render(), `<p>${successMsg}</p>`);

  if (success) {
    // Roll for location effect and add it to the output
  }
}

async function rollCritEffect(hardwareType, hitLocation=null) {
  const aerospace = hardwareType === "aerospace";
  if (["rotor", "head", "side"].includes(hitLocation)) {
    // No roll necessary
  }
  const formula = aerospace ? "2d6" : "1d6";
}

function getCritEffect(hardwareType, hitLocation, rollTotal) {
  // Handle fixed effects
  switch (hardwareType) {
    case "mech":
      return getMechCritEffect(hitLocation, rollTotal);
    case "combatVehicle":
      return getCombatVehicleCritEffect(hitLocation, rollTotal);
    case "vtol":
      return getVtolCritEffect(hitLocation, rollTotal);
    case "aerospace":
      return getAeroCritEffect();
  }
}

function getMechCritEffect(hitLocation, rollTotal) {
  let locString = "";

  if (hitLocation === "head") {
    locString = ""
  }
}

function getCombatVehicleCritEffect(hitLocation, rollTotal) {}

function getVtolCritEffect(hitLocation, rollTotal) {}

function getAeroCritEffect(rollTotal) {}
