export default class MwDestinyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      damageType: new fields.StringField({
        nullable: true,
      }),
      isStunWeapon: new fields.BooleanField({
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        initial: false,
      }),
      range: new fields.ObjectField({
        required: true,
        initial: Object.fromEntries(["close", "near", "far"].map(
            (r) => [r, {usable: false, mod: null}],
        )),
      }),
      weaponSkillType: new fields.StringField({
        nullable: true,
      }),
    };
  }

  get damage() {
    if (this.isStrPowered) {
      return this.baseDamage + (this.parent.actor.system.strBonus || 0);
    }

    return this.baseDamage;
  }

  get weaponSkill() {
    return this.parent.actor.items.find((i) => i.type === "skill" && i.system.weaponSkillType === this.weaponSkillType);
  }

  get damageCode() {
    let typeString = "";

    switch (this.damageType) {
      case "ballistic":
        typeString = " (B)";
        break;
      case "missile":
        typeString = " (M)";
        break;
      case "energy":
        typeString = " (E)";
        break;
    }

    return this.isStunWeapon ? `${this.damage}F${typeString}` : `${this.damage}F${typeString}`;
  }
}
