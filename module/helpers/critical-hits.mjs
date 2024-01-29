export async function rollCriticalCheck(hardwareType, hitLocation=null) {
  if (!["mech", "combatVehicle", "aerospace"].contains(hardwareType)) {
    return await ui.notifications.warn("MWDESTINY.notifications.noCritLocations");
  }

  const flavor = game.i18n.localize("MWDESTINY.sheet.criticalHitCheck");
  const rollFormula = hardwareType === "aerospace" ? "2d6" : "1d6";
  const critCheckTn = 8;
  const successMsg = game.i18n.localize("MWDESTINY.sheet.critCheckSuccess");
  const failureMsg = game.i18n.localize("MWDESTINY.sheet.critCheckFailure");

  // Check for crit with rollGenericCheck

  // Roll for location effect and add it to the output
}
