export default class MwDestinySkillData extends foundry.abstract.DataModel {
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
    };
  }
}
