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

  async toggleStatus(id, activate) {
    const originalEffect = this.effects.find((e) => e.statuses.has(id));

    if (activate && !originalEffect) {
      const newEffect = CONFIG.statusEffects.find((e) => e.id === id);

      if (!newEffect) {
        return;
      }

      newEffect.statuses = [id];
      newEffect.name = game.i18n.localize(newEffect.name);

      await this.createEmbeddedDocuments("ActiveEffect", [newEffect]);
    } else if (!activate && originalEffect) {
      await this.deleteEmbeddedDocuments("ActiveEffect", [originalEffect.id]);
    }
  }

  async dissipateHeat() {
    // Don't do anything unless this is a mech or aerofighter
    if (this.system?.hardwareType !== "mech" || this.system?.hardwareType !== "aerospace") {
      return 0;
    }

    const actorData = this.system;
    const heatBuildup = actorData.heatBuildup || 0;
    const prevHeat = actorData.heat || 0;
    const dissipation = actorData.heatDissipation || 0;

    const currentHeat = Math.max(heatBuildup + prevHeat - dissipation, 0);

    await this.update({"system.heat": currentHeat, "system.heatBuildup": 0});

    // Remove overheating effect (re-apply it each time for now)
    const heatEffectIds = this.effects.filter((e) => e.statuses.has("overheating")).map((e) => e.id);
    await this.deleteEmbeddedDocuments("ActiveEffect", heatEffectIds);

    // If there's no heat remaining, we're done
    if (currentHeat < 1) {
      return currentHeat;
    }

    // Otherwise, apply an active effect as appropriate
    const {ADD} = CONST.ACTIVE_EFFECT_MODES;

    const changes = [
      {
        key: "system.movement",
        value: -1,
        mode: ADD,
      },
    ];

    if (currentHeat > 1) {
      changes.push({
        key: "system.rangedHeatMod",
        value: -1,
        mode: ADD,
      });
    }

    const effect = {
      name: `${game.i18n.localize("MWDESTINY.status.overheating")} (${currentHeat})`,
      icon: "systems/mw-destiny/assets/img/icon/overheating.svg",
      statuses: ["overheating"],
      changes,
    };

    this.createEmbeddedDocuments("ActiveEffect", [effect]);

    return currentHeat;
  }
}
