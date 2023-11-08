export default class MwDestinyItemData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      // Skill stuff
      link: new fields.StringField({
        required: true,
        initial: "str",
      }),
      rank: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      total: new fields.NumberField({
        required: true,
        initial: 0,
        integer: true,
      }),
      baseDamage: new fields.NumberField({
        required: false,
        integer: true,
      }),
      damageType: new fields.StringField({
        required: false,
        initial: "other",
      }),
      isFatigueWeapon: new fields.BooleanField({
        required: false,
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        required: false,
        initial: false,
      }),
      ranges: new fields.ObjectField({
        required: false,
        initial: {
          close: 0,
        },
      }),
    };
  },

  get damage() {
    const baseDamage = this.baseDamage;
    if (this.isStrPowered) {
      const str = this.attributes.str;
      if (str < 3) return baseDamage;
      if (str < 5) return baseDamage + 1;
      return baseDamage + 2;
    }
    return 0;
  }
}
