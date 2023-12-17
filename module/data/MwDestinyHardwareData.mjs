import getSharedActorData from "./shared-actor-data.mjs";
export default class MwDestinyHardwareData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const hp = new fields.SchemaField(Object.fromEntries(Object.entries(CONFIG.MWDESTINY.hitLocations)
        .map(([hwType, locArray]) => [hwType, new fields.SchemaField(Object.fromEntries(locArray
            .map((loc) => [loc, new fields.SchemaField(Object.fromEntries(["armor", "structure"]
                .map((hpType) => [hpType, new fields.SchemaField({
                  min: new fields.NumberField({integer: true, initial: 0, readonly: true}),
                  max: new fields.NumberField({positive: true, integer: true}),
                  value: new fields.NumberField({integer: true}),
                })],
                ))),
            ])))])));

    return {
      ...getSharedActorData(),
      hardwareType: new fields.StringField({
        choices: Object.keys(CONFIG.MWDESTINY.hardwareTypes),
        initial: Object.keys(CONFIG.MWDESTINY.hardwareTypes)[0],
      }),
      model: new fields.StringField(),
      tonnage: new fields.NumberField({integer: true}),
      movement: new fields.NumberField({integer: true}),
      hasJumpJets: new fields.BooleanField(),
      heatDissipation: new fields.NumberField({integer: true}),
      hp,
      heat: new fields.NumberField({min: 0, integer: true}),
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

  get woundPenalty() {
    return this.pilot?.system?.woundPenalty || 0;
  }

  get pilotingSkillType() {
    if (this.hardwareType === "vtol" || this.hardwareType === "vehicle") return "combatVehicle";
    return this.hardwareType;
  }

  get pilotingSkill() {
    return this.pilot?.items.find((i) => i.type === "skill" &&
      i.system.pilotingSkillType === this.pilotingSkillType);
  }
}
