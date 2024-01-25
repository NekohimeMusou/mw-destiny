export default function registerHooks() {
  Hooks.on("combatStart", _turnUpdate);

  Hooks.on("combatRound", _turnUpdate);

  Hooks.on("combatTurn", _turnUpdate);
}

async function _turnUpdate(combat, updateData, updateOptions={}) {
  await _handleTurnEnd(combat.combatant);
  await _handleTurnStart(combat.nextCombatant);
}

async function _handleTurnEnd(combatant) {
  const actor = combatant.actor;

  if (actor?.type === "hardware") {
    await _hardwareTurnEnd(actor);
  }
}

async function _hardwareTurnEnd(token) {
  const actor = token.actor;
  // Turn off MASC
  await actor.toggleStatus("mascActive", false);

  // This is all heat-related, and only mechs and aerofighters heat up
  if (!(actor.system?.hardwareType === "mech" || actor.system?.hardwareType === "aerospace")) {
    return;
  }

  const {heatContent, heatRolls} = await _applyHeatEffects(actor);

  const {engineContent, engineRolls, didEngineStart} = await _restartEngine(actor);

  const contentStrings = [...heatContent, ...engineContent];
  const rolls = [...heatRolls, ...engineRolls];

  if (actor.system.engineCrit && !didEngineStart) {
    contentStrings.push(`<p>${game.i18n.localize("MWDESTINY.heat.engineCritTurnMsg")}</p>`);
    await actor.update({"system.heat": actor.system.heat + 1});
  }

  // Create chat message with output
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({token}),
    rolls,
    content: `<div class=flexcol>\n${contentStrings.join("\n")}\n</div>`,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  };

  await ChatMessage.create(chatData);
}

async function _applyHeatEffects(actor) {
  const dissipatedHeat = await actor.dissipateHeat();

  const currentHeat = actor.system.heat || 0;

  const content = [`<p>${game.i18n.format("MWDESTINY.heat.heatLevelMsg", {heatLevel: game.i18n.localize(actor.system.heatEffect), heat: currentHeat})}</p>`];
  const rolls = [];

  if (dissipatedHeat > 0) {
    content.push(`<p>${game.i18n.format("MWDESTINY.heat.heatDissipatedMsg", {dissipated: dissipatedHeat})}</p>`);
  }

  if (currentHeat >= 4) {
    const ammoExplosionRoll = await new Roll("2d6", actor.rollData).roll({async: true});
    const ammoExplosion = ammoExplosionRoll.total < 8;
    const ammoMsg = ammoExplosion ? "ammoExplosionMsg" : "ammoExplosionAvoidMsg";

    content.push(
        `<p>${game.i18n.localize("MWDESTINY.heat.ammoExplosionRollMsg")}:</p>`,
        await ammoExplosionRoll.render(),
        `<p>${game.i18n.localize(`MWDESTINY.heat.${ammoMsg}`)}:</p>`,
    );
  }

  if (currentHeat >= 3 && !actor.system.isShutDown) {
    if (currentHeat >= 5) {
      content.push(
          `<p>${game.i18n.localize("MWDESTINY.heat.autoShutdownMsg")}</p>`,
          `<p>${game.i18n.localize("MWDESTINY.heat.shutdownInitiatedMsg")}</p>`,
          `<p>${game.i18n.localize("MWDESTINY.heat.shutdownMsg")}</p>`,
      );

      actor.toggleStatus("shutdown", true);
    } else {
      // Make shutdown roll
      const shutdownRoll = await new Roll("2d6", actor.rollData).roll({async: true});
      const shuttingDown = shutdownRoll.total < 8;

      actor.toggleStatus("shutdown", shuttingDown);
      const shutdownMsg = shuttingDown ? "shutdownMsg" : "shutdownOverrideMsg";

      content.push(
          `<p>${game.i18n.localize("MWDESTINY.heat.shutdownInitiatedMsg")}</p>`,
          await shutdownRoll.render(),
          `<p>${game.i18n.localize(`MWDESTINY.heat.${shutdownMsg}`)}</p>`,
      );
    }
  }

  return {heatContent: content, heatRolls: rolls};
}

async function _restartEngine(actor) {
  if (!actor.system.isShutDown) {
    return {engineContent: [], engineRolls: [], didEngineStart: false};
  }

  const hardwareType = game.i18n.localize(`MWDESTINY.hardware.types.${actor.system.hardwareType}`);
  const content = [`<p>${game.i18n.format("MWDESTINY.heat.shutdownAtTurnStartMsg", {hardwareType})}</p>`];
  const rolls = [];
  const heat = actor.system.heat;

  let didEngineStart = heat < 3;

  if (heat === 3) {
    const restartRoll = await new Roll("2d6", actor.rollData).roll({async: true});
    rolls.push(restartRoll);
    didEngineStart = restartRoll.total >= 8;

    content.push(
        `<p>${game.i18n.localize("MWDESTINY.heat.restartAttemptMsg")}</p>`,
        restartRoll.render(),
    );
  }

  let restartSuccessMsg = game.i18n.localize("restartFailMsg");

  if (didEngineStart) {
    const restartStatus = actor.system.engineCrit ? "restartStatusEngineCrit" : "restartStatusNominal";
    const restartStatusMsg = game.i18n.localize(`MWDESTINY.heat.${restartStatus}`);

    restartSuccessMsg = game.i18n.format("MWDESTINY.heat.restartSuccessMsg", {status: restartStatusMsg});
  }

  content.push(`<p>${restartSuccessMsg}</p>`);

  return {
    engineContent: content,
    engineRolls: rolls,
    didEngineStart,
  };
}

async function _handleTurnStart(combatant) {
  const actor = combatant.actor;

  if (actor?.type === "hardware") {
    await _hardwareTurnStart(actor);
  }
}

async function _hardwareTurnStart(token) {
  const actor = token.actor;

  // Turn off jump jets
  await actor.toggleStatus("jumpJetsActive", false);

  // Turn on MASC, if applicable
  if (!actor.isShutDown) {
    await actor.toggleStatus("mascActive", actor.system.hasMasc);
  }
}
