export default class MwDestinyItem extends Item {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    this._prepareSkillData();
  }
  /** @override */
  prepareDerivedData() {
    this._prepareWeaponData();
  }

  _prepareSkillData() {
    if (this.type !== "skill") return;

    const linkedAttribute = this.actor?.system.attributes[this.system.link];

    this.system.total = this.system.rank + linkedAttribute;
  }

  _prepareWeaponData() {
    if (this.type !== "weapon") return;

    for (const r of Object.values(this.system.range)) {
      if (!r.usable) {
        r.label = "—";
      } else if (!r.mod) {
        r.label = "OK";
      } else {
        r.label = r.mod;
      }
    }

    let typeCode = "";

    if (this.system.damageType === "ballistic") typeCode = " (B)";
    if (this.system.damageType === "energy") typeCode = " (E)";

    if (this.system.isStunWeapon) {
      this.system.damageCode = `${this.system.baseDamage}F${typeCode}`;
    } else {
      this.system.damageCode = `${this.system.baseDamage}${typeCode}`;
    }

    this.weaponSkill = this.actor.items.find((i) => i.system.weaponSkillType === this.system.weaponSkillType);
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
