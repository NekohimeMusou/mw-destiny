export default class MwDestinyHeavyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({integer: true}),
      damageType: new fields.StringField({
        choices: ["ballistic", "energy", "missile"],
      }),
      missileCount: new fields.NumberField({integer: true}),
      missileMax: new fields.NumberField({integer: true}),
      cluster: new fields.NumberField({integer: true}),
      heat: new fields.NumberField({integer: true}),
      location: new fields.StringField(),
      range: new fields.ObjectField({
        initial: Object.fromEntries(Object.keys(CONFIG.MWDESTINY.weaponRange.heavy).map(
            (r) => [r, {usable: false, mod: 0}],
        )),
      }),
      primary: new fields.BooleanField(),
      weaponSkillType: new fields.StringField({
        required: true,
        choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
        initial: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes)[0],
      }),
    };
  }

  // TODO: roll for missile damage

  get weaponSkill() {
    const pilot = this.parent.actor.system.pilot;
    return pilot?.items.find((i) => i.type === "skill" &&
      i.system.weaponSkillType === this.weaponSkillType);
  }

  get damageTypeCode() {
    return this.damageType?.[0].toUpperCase() || "—";
  }

  get damageCode() {
    const dmg = this.baseDamage || 0;
    const cluster = this.cluster > 0 ? ` (C${this.cluster})`: "";

    const missileStr = this.missileCount > 0 ? ` + ${"M".repeat(this.missileCount)} (Max ${this.missileMax})` : "";

    return `${dmg}${cluster}${missileStr}`;
  }
}
