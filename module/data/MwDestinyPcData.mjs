export default class MwDestinyPcData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const attributes = new fields.SchemaField(
        Object.fromEntries(
            ["str", "rfl", "int", "wil", "cha", "edg"].map(
                (a) => [a,
                  new fields.NumberField({
                    initial: 1,
                    integer: true,
                  }),
                ],
            ),
        ));

    return {
      description: new fields.HTMLField(),
      history: new fields.HTMLField(),
      personality: new fields.HTMLField(),
      affiliation: new fields.StringField(),
      cues: new fields.ArrayField(new fields.StringField({
        required: true,
        initial: Array.from(Array(30), (_e, _i) => ""),
      })),
      physDamage: new fields.SchemaField({
        min: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        max: new fields.NumberField({
          required: true,
          initial: 1,
          integer: true,
        }),
        value: new fields.NumberField({
          required: true,
          initial: 1,
        }),
      }),
      fatigueDamage: new fields.SchemaField({
        min: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
        max: new fields.NumberField({
          required: true,
          initial: 1,
          integer: true,
        }),
        value: new fields.NumberField({
          required: true,
          initial: 1,
          integer: true,
        }),
      }),
      attributes,
    };
  }

  get strBonus() {
    if (this.attributes.str < 3) return 0;
    if (this.attributes.str < 5) return 1;
    return 2;
  }
}
