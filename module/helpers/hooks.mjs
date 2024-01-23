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
  const current = combat.combatant?.actor;
  const next = combat.nextCombatant.actor;

  // Turn off jump jets for the next actor, if applicable
  next.toggleStatus("jumpJetsActive", false);

  // Turn off MASC for the current actor, if applicable
  current.toggleStatus?.("mascActive", false);

  // Turn on MASC for the next one, if applicable
  next.toggleStatus("mascActive", next.system.hasMasc);

  // Since the current player's narration is over, dissipate heat
  current.dissipateHeat?.();
}
