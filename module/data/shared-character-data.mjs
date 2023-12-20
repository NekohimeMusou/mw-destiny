export default function getSharedCharacterData() {
  const fields = foundry.data.fields;

  return {
    physDamage: new fields.SchemaField({
      min: new fields.NumberField({
        readonly: true,
        initial: 0,
        integer: true,
      }),
      max: new fields.NumberField({
        integer: true,
        positive: true,
      }),
      value: new fields.NumberField({
        integer: true,
      }),
    }),
    fatigueDamage: new fields.SchemaField({
      min: new fields.NumberField({
        readonly: true,
        initial: 0,
        integer: true,
      }),
      max: new fields.NumberField({
        positive: true,
        integer: true,
      }),
      value: new fields.NumberField({
        integer: true,
      }),
    }),
    armor: new fields.SchemaField({
      hp: new fields.SchemaField({
        min: new fields.NumberField({
          initial: 0,
          integer: true,
        }),
        max: new fields.NumberField({
          integer: true,
        }),
        value: new fields.NumberField({
          integer: true,
        }),
      }),
      type: new fields.StringField(),
      effect: new fields.StringField(),
    }),
    ignoreWoundPenalty: new fields.BooleanField(),
  };
}
