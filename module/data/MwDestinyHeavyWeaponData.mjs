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
      heat: new fields.NumberField({integer: true}),
      location: new fields.ArrayField(new fields.StringField()),
      range: new fields.ObjectField({
        initial: Object.fromEntries(["pointblank", "short", "medium", "long"].map(
            (r) => [r, {usable: false, mod: null}],
        )),
      }),
      primary: new fields.BooleanField(),
    };
  }

  get damageCode() {
    const dmg = this.damage || 0;

    if (!this.damageType) return `${dmg}`;

    const dmgInitial = this.damageType.at(0).toUpperCase();

    return `${dmg} (${dmgInitial})`;
  }
}
