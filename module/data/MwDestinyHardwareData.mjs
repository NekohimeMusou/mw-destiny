export default class MwDestinyHardwareData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const hp = new fields.SchemaField(Object.fromEntries(
        ["head", "torso", "armLeft", "armRight", "legLeft", "legRight"]
            .map((p) => [p, new fields.SchemaField({
              armor: new fields.SchemaField({
                min: new fields.NumberField(),
                max: new fields.NumberField(),
                value: new fields.NumberField(),
              }),
              structure: new fields.SchemaField({
                min: new fields.NumberField(),
                max: new fields.NumberField(),
                value: new fields.NumberField(),
              }),
            })])));

    return {
      description: new fields.HTMLField(),
      tonnage: new fields.NumberField({
        required: true,
        integer: true,
      }),
      movement: new fields.NumberField({
        required: true,
        integer: true,
      }),
      hasJumpJets: new fields.BooleanField(),
      heatDissipation: new fields.NumberField({
        required: true,
        integer: true,
      }),
      tags: new fields.ArrayField(new fields.StringField({initial: ""})),
      hp,
    };
  }
}
