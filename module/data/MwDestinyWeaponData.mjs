export default class MwDestinyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({
        required: true,
        integer: true,
      }),
      damageType: new fields.StringField({
        required: true,
        initial: "other",
      }),
      isFatigueWeapon: new fields.BooleanField({
        required: true,
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        required: true,
        initial: false,
      }),
      ranges: new fields.ObjectField({
        required: true,
      }),
    };
  }
}
