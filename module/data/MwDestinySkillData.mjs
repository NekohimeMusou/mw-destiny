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
      weaponSkillType: new fields.StringField({
        choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
      }),
    };
  }

  get total() {
    const linkedAttribute = this.parent.actor.system.attributes[this.link] || 0;

    return this.rank + linkedAttribute;
  }
}
