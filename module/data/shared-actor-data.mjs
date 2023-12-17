export default function getSharedActorData() {
  const fields = foundry.data.fields;


  return {
    description: new fields.HTMLField(),
    tags: new fields.ArrayField(new fields.StringField(), {
      required: true,
      initial: Array(5).fill(""),
    }),
    equipment: new fields.ArrayField(new fields.StringField(), {
      initial: Array(6).fill(""),
    }),
  };
}
