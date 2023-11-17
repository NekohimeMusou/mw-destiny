export default class MwDestinyHeavyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      damage: new fields.NumberField(),
      damageType: new fields.StringField({
        choices: ["", "ballistic", "energy"],
      }),
      heat: new fields.NumberField(),
      location: new fields.StringField(),
      range: new fields.ObjectField({
        initial: Object.fromEntries(["pointblank", "short", "medium", "long"].map(
            (r) => [r, {usable: false, mod: null}],
        )),
      }),
    };
  }
}
