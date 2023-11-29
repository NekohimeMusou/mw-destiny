export default class MwDestinyHardwareData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const hp = new fields.SchemaField(Object.fromEntries(
        ["head", "torso", "armLeft", "armRight", "legLeft", "legRight"]
            .map((p) => [p, new fields.SchemaField({
              armor: new fields.SchemaField({
                min: new fields.NumberField({min: 0, integer: true}),
                max: new fields.NumberField({min: 1, integer: true}),
                value: new fields.NumberField({min: 0, integer: true}),
              }),
              structure: new fields.SchemaField({
                min: new fields.NumberField({min: 0, integer: true}),
                max: new fields.NumberField({min: 1, integer: true}),
                value: new fields.NumberField({min: 0, integer: true}),
              }),
            })])));

    return {
      description: new fields.HTMLField(),
      model: new fields.StringField(),
      tonnage: new fields.NumberField({integer: true}),
      movement: new fields.NumberField({integer: true}),
      hasJumpJets: new fields.BooleanField(),
      heatDissipation: new fields.NumberField({integer: true}),
      tags: new fields.ArrayField(new fields.StringField(), {
        initial: Array(5).fill(""),
      }),
      hp,
      heat: new fields.NumberField({min: 0, integer: true}),
      equipment: new fields.ArrayField(new fields.StringField(), {
        initial: Array(6).fill(""),
      }),
      pilotId: new fields.StringField(),
    };
  }

  get weightClass() {
    if (this.tonnage < 40) return "light";
    if (this.tonnage < 60) return "medium";
    if (this.tonnage < 80) return "heavy";
    if (this.tonnage <= 100) return "assault";
    return "superheavy";
  }

  get pilot() {
    return game.actors.get(this.pilotId);
  }

  get weaponSkill() {
    return this.pilot?.items.find((i) => i.type === "skill" && i.system.weaponSkillType === this.weaponSkillType);
  }

  get pilotingSkill() {
    return this.pilot?.items.getName("Piloting");
  }
}
