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
  await _handleCurrentActor(combat.combatant?.actor);
  await _handleNextActor(combat.nextCombatant.actor);
}

async function _handleCurrentActor(actor) {
  // If there's no actor, like it's the first turn, stop
  if (!actor) {
    return;
  }

  // Turn off MASC
  actor.toggleStatus("mascActive", false);

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

async function _handleNextActor(actor) {
  // There should always be a next actor, but check anyway
  if (!actor) {
    return;
  }

  // Turn off jump jets for the next actor, if applicable
  actor.toggleStatus("jumpJetsActive", false);

  // Turn on MASC for the next one, if applicable
  actor.toggleStatus("mascActive", actor.system.hasMasc);
}
