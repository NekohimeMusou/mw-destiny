export default function registerHooks() {
  Hooks.on("combatStart", async function(combat, updateData) {
    // Check if next combatant has MASC and activate it
    return;
  });

  Hooks.on("combatRound", async function(combat, updateData, updateOptions) {
    //  Check if next combatant has MASC and activate it
    return;
  });

  Hooks.on("combatTurn", async function(combat, updateData, updateOptions) {
    const tokenId = combat.combatant.tokenId;
    const token = combat.scene.tokens.get(tokenId);
    const actor = token.actor;

    await _handleHardwareCombatTurn(actor);
  });
}

async function _handleHardwareCombatTurn(actor) {
  if (!actor.type === "hardware") {
    return;
  }

  const actorData = actor.system;

  // FIXME: Keep track of state for rewinding

  // Handle heat

  const heatBuildup = actorData?.heatBuildup || 0;
  const currentHeat = actorData?.heat || 0;
  const dissipation = actorData?.heatDissipation || 0;

  const newHeat = Math.max(heatBuildup + currentHeat - dissipation, 0);

  // Handle jump jet effect

  // Deactivate MASC

  // Check if next combatant has MASC and activate it

  // Update actor
  await actor.update({"system.heat": newHeat, "system.heatBuildup": 0});
}
