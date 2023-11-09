export default class MwDestinyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const defaultRanges = ["close", "near", "far"].map(
        (r) => ({label: `MWDESTINY.combat.range.${r}`, usable: false, mod: 0}),
    );

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      damageType: new fields.StringField({
        required: true,
        nullable: true,
      }),
      isStunWeapon: new fields.BooleanField({
        required: true,
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        required: true,
        initial: false,
      }),
      range: new fields.ObjectField({
        required: true,
        default: defaultRanges,
      }),
    };
  }
}
