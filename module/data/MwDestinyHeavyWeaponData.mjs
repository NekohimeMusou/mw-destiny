export default class MwDestinyHeavyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({integer: true}),
      damageType: new fields.StringField({
        choices: ["ballistic", "energy", "missile"],
      }),
      missileDice: new fields.NumberField({integer: true}),
      missileMaxDamage: new fields.NumberField({integer: true}),
      heat: new fields.NumberField({integer: true}),
      location: new fields.StringField(),
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

  get damageTypeCode() {
    return this.damageType?.[0].toUpperCase() || "—";
  }

  // TODO: Include missile damage
  get damageCode() {
    const dmg = this.baseDamage || 0;

    if (this.damageType !== "missile") return `${dmg}`;

    const missileDice = "M".repeat(this.missileDice);

    const maxDmg = this.missileMaxDamage;

    return `${dmg} + ${missileDice} (${game.i18n.localize("MWDESTINY.hardware.missileMax")} ${maxDmg})`;
  }
}
