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
      damageCode: new fields.StringField(),
      weaponSkillType: new fields.StringField({
        nullable: true,
      }),
      weaponSkill: new fields.ObjectField(),
    };
  }

  get damage() {
    if (this.isStrPowered) {
      return this.baseDamage + this.parent.strBonus || 0;
    }

    return this.baseDamage;
  }
}
