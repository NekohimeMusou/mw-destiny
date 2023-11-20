export default class MwDestinyItem extends Item {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
  }
  /** @override */
  prepareDerivedData() {
    this._prepareSkillData();
    this._prepareWeaponData();
  }

  _prepareSkillData() {
    if (this.type !== "skill") return;
  }

  _prepareWeaponData() {
    if (this.type !== "weapon") return;

    // DataModel getters?
    for (const r of Object.values(this.system.range)) {
      if (!r.usable) {
        r.label = "—";
      } else if (!r.mod) {
        r.label = "OK";
      } else {
        r.label = r.mod;
      }
    }
  }

  /** @inheritdoc */
  getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;

    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }
}
