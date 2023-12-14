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
    if (!(this.type === "pc" || this.type === "npc")) return;

    const str = this.system.attributes.str;
    const wil = this.system.attributes.wil;
    this.system.physDamage.max = Math.min(9 + str, 14);
    this.system.fatigueDamage.max = Math.min(9 + wil, 14);
  }

  /** @inheritdoc */
  getRollData() {
    const rollData = foundry.utils.deepClone(super.getRollData());

    const attributes = rollData.attributes || this.system?.pilot.system.attributes;
    if (attributes) {
      foundry.utils.mergeObject(rollData, attributes);
    }

    return rollData;
  }
}
