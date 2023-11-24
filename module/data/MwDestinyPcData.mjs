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
                    positive: true,
                  }),
                ],
            ),
        ));

    return {
      history: new fields.HTMLField(),
      personality: new fields.HTMLField(),
      lifeModules: new fields.SchemaField(Object.fromEntries(
          ["faction", "childhood", "higherEd", "realLife"].map(
              (m) => [m, new fields.StringField()],
          ),
      )),
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
          positive: true,
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
      tags: new fields.ArrayField(new fields.StringField(), {
        initial: Array(5).fill(""),
      }),
      cues: new fields.ArrayField(new fields.StringField(), {
        initial: Array(18).fill(""),
      }),
      dispositions: new fields.ArrayField(new fields.StringField(), {
        initial: Array(4).fill(""),
      }),
      armor: new fields.SchemaField({
        hp: new fields.SchemaField({
          min: new fields.NumberField({
            initial: 0,
            integer: true,
          }),
          max: new fields.NumberField({
            initial: 1,
            integer: true,
            positive: true,
          }),
          value: new fields.NumberField({
            initial: 1,
            integer: true,
          }),
        }),
        type: new fields.StringField(),
        effect: new fields.StringField(),
      }),
      equipment: new fields.ArrayField(new fields.StringField(), {
        initial: Array(6).fill(""),
      }),
    };
  }

  get strBonus() {
    if (this.attributes.str < 3) return 0;
    if (this.attributes.str < 5) return 1;
    return 2;
  }
}
