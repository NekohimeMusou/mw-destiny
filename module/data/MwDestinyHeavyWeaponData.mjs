import getSharedWeaponData from "./shared-weapon-data.mjs";
export default class MwDestinyHeavyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const weaponType = "heavy";

    return {
      ...getSharedWeaponData(weaponType),
      missileCount: new fields.NumberField({integer: true}),
      missileMax: new fields.NumberField({integer: true}),
      cluster: new fields.NumberField({integer: true}),
      heat: new fields.NumberField({integer: true}),
      location: new fields.StringField(),
      primary: new fields.BooleanField(),
    };
  }

  get damage() {
    return this.baseDamage;
  }

  get weaponSkill() {
    const pilot = this.parent.actor.system.pilot;
    return pilot?.items.find((i) => i.type === "skill" &&
      i.system.weaponSkillType === this.weaponSkillType);
  }

  get damageTypeCode() {
    return this.damageType?.[0]?.toUpperCase() || "—";
  }

  get damageCode() {
    const dmg = this.baseDamage || 0;
    const cluster = this.cluster > 0 ? ` (C${this.cluster})`: "";

    const missileStr = this.missileCount > 0 ? ` + ${"M".repeat(this.missileCount)} (Max ${this.missileMax})` : "";

    return `${dmg}${cluster}${missileStr}`;
  }
}
