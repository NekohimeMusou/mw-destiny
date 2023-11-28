export default class MwDestinyHeavyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      damage: new fields.NumberField({integer: true}),
      damageType: new fields.StringField({
        choices: ["ballistic", "energy", "missile"],
      }),
      missileDice: new fields.NumberField({integer: true}),
      missileMaxDamage: new fields.NumberField({integer: true}),
      heat: new fields.NumberField({integer: true}),
      location: new fields.ArrayField(new fields.StringField()),
      range: new fields.ObjectField({
        initial: Object.fromEntries(Object.keys(CONFIG.MWDESTINY.weaponRange.heavy).map(
            (r) => [r, {usable: false, mod: null}],
        )),
      }),
      primary: new fields.BooleanField(),
      weaponSkillType: new fields.StringField({
        choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
      }),
    };
  }

  get damageCode() {
    const dmg = this.damage || 0;

    if (!this.damageType) return `${dmg}`;

    const dmgInitial = this.damageType?.[0].toUpperCase() || "";

    return `${dmg} (${dmgInitial})`;
  }

  get weaponSkillType() {
    return "gunnery";
  }
}
