export default function registerHooks() {
  Hooks.on("combatStart", _onCombatStart);

  Hooks.on("combatRound", _onCombatRound);

  Hooks.on("combatTurn", _onCombatTurn);
}

async function _onCombatStart(combat, updateData) {
  await _turnUpdate(combat);
}

// REMEMBER TO DISSIPATE HEAT
async function _onCombatTurn(combat, updateData, updateOptions) {
  await _turnUpdate(combat);
}

async function _onCombatRound(combat, updateData, updateOptions) {
  await _turnUpdate(combat);
}

async function _turnUpdate(combat) {
  // FIXME: Get a list of mechs the actor pilots and iterate
  // This code pretends that the guys in init are mechs
  await _handleTurnEnd(combat.combatant);
  await _handleTurnStart(combat.nextCombatant);
}

async function _handleTurnEnd(combatant) {
  // Get controlled hardware actors from tokens in current scene
  const controlledHardware = _getControlledHardware(combatant);

  for (const hardware of controlledHardware) {
    await _hardwareTurnEnd(hardware);
  }
}

async function _hardwareTurnEnd(actor) {
  // Turn off MASC
  actor.toggleStatus("mascActive", false);

  // Dissipate heat (check for shutdown!)
  // Roll for startup
  // TODO: return ChatMessage for use with map()

  // PASTED FROM OLD FUNC

  // Cool down first, then check for engine restart
  // Only display cooldown/restart if a mech is being piloted

  // If 4+, roll for ammo explosion; don't stop, in case the mech doesn't carry ammo
  // If 5+, auto shutdown
  // Else if 3+, roll for shutdown
  // Only mechs and aerofighters heat up
  if (actor.system?.hardwareType === "mech" || actor.system?.hardwareType === "aerospace") {
    const heat = actor.dissipateHeat();
    if (heat >= 4 && !actor.system.isShutDown) {
      // Roll for ammo explosion
    }

    if (heat >= 5 && !actor.system.isShutDown) {
      // Show auto shutdown notice
    }
  }

  if (actor.system.engineCrit && !actor.system.isShutDown) {
    await actor.update({"system.heat": actor.system.heat + 1});
  }

  // Engine crit heat doesn't apply until the Narration AFTER the engine is
  // restarted. Seems reasonable to me, but I'm not sure if it's correct
}

async function _handleTurnStart(combatant) {
  const controlledHardware = _getControlledHardware(combatant);

  for (const hardware of controlledHardware) {
    await _hardwareTurnStart(hardware);
  }
}

async function _hardwareTurnStart(actor) {
  // Turn off jump jets
  actor.toggleStatus("jumpJetsActive", false);

  // Turn on MASC, if applicable
  actor.toggleStatus("mascActive", actor.system.hasMasc);
}

function _getControlledHardware(combatant) {
  const actor = combatant?.actor;
  const scene = game.scenes.get(combatant?.sceneId);

  // There should always be a next actor, but check anyway
  if (!actor || !scene) {
    return;
  }

  // Get controlled hardware actors from tokens in current scene
  return scene.tokens.filter((t) => t.actor.system?.pilotId === actor.id)
      .map((t) => t.actor);
}
