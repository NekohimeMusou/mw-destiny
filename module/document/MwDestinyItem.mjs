export default class MwDestinyItem extends Item {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    this._prepareSkillData();
    this._prepareWeaponData();
  }

  _prepareSkillData() {
    if (this.type !== "skill") return;

    const linkedAttribute = this.actor?.system.attributes[this.system.link];

    this.system.total = this.system.rank + linkedAttribute;
  }

  _prepareWeaponData() {
    if (this.type !== "weapon") return;
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
