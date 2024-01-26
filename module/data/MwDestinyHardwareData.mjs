import getSharedActorData from "./shared-actor-data.mjs";
export default class MwDestinyHardwareData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static migrateData(source) {
    if ("baseMovement" in source) {
      source.movement = source.baseMovement || 0;
      delete source.baseMovement;
    }

    // 0.9.0 heat fix
    source.heat = source.heat || 0;

    // 0.9.0 hardware pilot changes
    delete source.pilotId;

    return super.migrateData(source);
  }

  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    // Generate armor and structure fields
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
      // The type of hardware ('Mech, combat vehicle, etc.)
      hardwareType: new fields.StringField({
        choices: Object.keys(CONFIG.MWDESTINY.hardwareTypes),
        initial: Object.keys(CONFIG.MWDESTINY.hardwareTypes)[0],
      }),
      hardwarePoints: new fields.NumberField({integer: true}),
      tonnage: new fields.NumberField(),
      // See if this plays nice with active effects
      movement: new fields.NumberField({min: 0, integer: true, initial: 0}),
      hasJumpJets: new fields.BooleanField(),
      heatDissipation: new fields.NumberField({integer: true}),
      hp,
      heat: new fields.NumberField({min: 0, integer: true, initial: 0}),
      heatBuildup: new fields.NumberField({min: 0, integer: true, initial: 0}),
      rangedHeatMod: new fields.NumberField({integer: true, initial: 0}),
      jumpJetMod: new fields.NumberField({integer: true, initial: 0}),
      canPunch: new fields.BooleanField({initial: true}),
      canKick: new fields.BooleanField({initial: true}),
      hasMasc: new fields.BooleanField(),
      engineCrit: new fields.BooleanField(),
      isShutDown: new fields.BooleanField(),
      pilotData: new fields.SchemaField({
        tokenId: new fields.StringField(),
        sceneId: new fields.StringField(),
      }),
    };
  }

  get weightClass() {
    if (this.hardwareType === "vehicle") {
      if (this.tonnage < 5) return "small";
      return "large";
    }

    if (this.hardwareType === "aerospace") {
      if (this.tonnage < 50) return "light";
      if (this.tonnage < 75) return "medium";
      return "heavy";
    }

    if (this.tonnage < 40) return "light";
    if (this.tonnage < 60) return "medium";
    if (this.tonnage < 80) return "heavy";
    if (this.tonnage <= 100) return "assault";
    return "superheavy";
  }

  get pilot() {
    const {tokenId, sceneId} = this.pilotData;
    const scene = game.scenes.get(sceneId);

    return scene?.tokens?.find((t) => t.id === tokenId)?.actor;
  }

  get pilotName() {
    const {tokenId, sceneId} = this.pilotData;
    const scene = game.scenes.get(sceneId);

    return scene?.tokens?.find((t) => t.id === tokenId)?.name;
  }

  // Convenience reference to the pilot's wound penalty
  get woundPenalty() {
    return this.pilot?.system?.woundPenalty || 0;
  }

  // The type of piloting skill required. VTOLs count as "combat vehicles".
  get pilotingSkillType() {
    if (this.hardwareType === "vtol" || this.hardwareType === "vehicle") return "combatVehicle";
    return this.hardwareType;
  }

  get gunnerySkillType() {
    if (this.hardwareType === "mech") return "gunneryMech";
    if (this.hardwareType === "aerospace") return "gunneryAerospace";
    return "gunneryVehicle";
  }

  // Convenience reference to the pilot's relevant Piloting skill.
  // Undefined if there's no skill.
  get pilotingSkill() {
    return this.pilot?.items.find((i) => i.type === "skill" &&
      i.system.pilotingSkillType === this.pilotingSkillType);
  }

  get gunnerySkill() {
    return this.pilot?.items.find((i) => i.type === "skill" &&
    i.system.weaponSkillType === this.gunnerySkillType);
  }

  get physDamage() {
    return {
      punch: (this.hardwareType === "mech" && this.canPunch) ? Math.ceil(this.tonnage / 30) : 0,
      kick: (this.hardwareType === "mech" && this.canPunch) ? Math.ceil(this.tonnage / 15) : 0,
      ram: (this.hardwareType === "combatVehicle" || this.hardwareType === "turretVehicle" || this.hardwareType === "vtol") ? Math.ceil((this.tonnage / 30) * this.movement) : 0,
    };
  }

  get heatEffect() {
    const index = Math.min(this.heat, 5);

    return `MWDESTINY.heatEffects.${index}`;
  }

  get jumpJetsActive() {
    return this.parent.effects.some((e) => e.statuses.has("jumpJetsActive"));
  }
}
