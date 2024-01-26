export default class MwDestinyActor extends Actor {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    this._preparePersonalHp();
  }

  _preparePersonalHp() {
    if (this.type === "hardware") return;

    const str = this.system.attributes.str;
    const wil = this.system.attributes.wil;
    this.system.physDamage.max = Math.min(9 + str, 14);
    this.system.fatigueDamage.max = Math.min(9 + wil, 14);
  }

  /** @inheritdoc */
  getRollData() {
    const rollData = foundry.utils.deepClone(super.getRollData());

    const attributes = rollData.attributes || this.system?.pilot?.system?.attributes;
    if (attributes) {
      foundry.utils.mergeObject(rollData, attributes);
    }

    return rollData;
  }

  async toggleStatus(id, activate, extraChanges=[]) {
    const originalEffect = this.effects.find((e) => e.statuses.has(id));

    if (activate && !originalEffect) {
      const newEffect = deepClone(CONFIG.statusEffects.find((e) => e.id === id));

      if (!newEffect) {
        return;
      }

      newEffect.statuses = [id];
      newEffect.name = game.i18n.localize(newEffect.name);
      newEffect.changes = newEffect.changes.concat(extraChanges);

      await this.createEmbeddedDocuments("ActiveEffect", [newEffect]);
    } else if (!activate && originalEffect) {
      await this.deleteEmbeddedDocuments("ActiveEffect", [originalEffect.id]);
    }
  }

  async dissipateHeat() {
    // Don't do anything unless this is a mech or aerofighter
    if (this.system?.hardwareType !== "mech" && this.system?.hardwareType !== "aerospace") {
      return 0;
    }

    const actorData = this.system;
    const heatBuildup = actorData.heatBuildup || 0;
    const prevHeat = actorData.heat || 0;
    const dissipation = actorData.heatDissipation || 0;

    const currentHeat = Math.max(heatBuildup + prevHeat - dissipation, 0);
    const dissipatedHeat = prevHeat - currentHeat;

    await this.update({"system.heat": currentHeat, "system.heatBuildup": 0});

    // Remove overheating effect (re-apply it each time for now)
    await this.toggleStatus("overheating", false);

    // If there's no heat remaining, we're done
    if (currentHeat < 1) {
      return dissipatedHeat;
    }

    // If we've got more than 1 heat, add the ranged attack penalty to the status
    const changes=[];

    if (currentHeat > 1) {
      changes.push({
        key: "system.rangedHeatMod",
        value: -1,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      });
    }

    await this.toggleStatus("overheating", true, changes);

    return dissipatedHeat;
  }

  async fireJumpJets() {
    if (!this.system.hasJumpJets || this.system.jumpJetsActive) {
      return;
    }

    // TODO: Consider adding chat output?
    await this.toggleStatus("jumpJetsActive", true);
    await this.update({"system.heatBuildup": this.system.heatBuildup + 1});
  }
}
