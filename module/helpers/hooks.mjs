export default function registerHooks() {
  Hooks.on("combatStart", _onCombatStart);

  Hooks.on("combatRound", _onCombatRound);

  Hooks.on("combatTurn", _onCombatTurn);
}

async function _onCombatStart(combat, updateData) {
  return;
}

// REMEMBER TO DISSIPATE HEAT
async function _onCombatTurn(combat, updateData, updateOptions) {
  const current = combat.combatant.actor;
  // const next = combat.nextCombatant.actor;

  // Since the current player's narration is over, dissipate heat
  current.dissipateHeat();
}

async function _onCombatRound(combat, updateData, updateOptions) {
  const current = combat.combatant.actor;
  // const next = combat.nextCombatant.actor;

  // Since the current player's narration is over, dissipate heat
  current.dissipateHeat();
}

