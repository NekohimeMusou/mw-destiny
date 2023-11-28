export default class MwDestinyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      baseDamage: new fields.NumberField({
        required: true,
        initial: 0,
      }),
      damageType: new fields.StringField(),
      isStunWeapon: new fields.BooleanField({
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        initial: false,
      }),
      range: new fields.ObjectField({
        required: true,
        initial: Object.fromEntries(Object.keys(CONFIG.MWDESTINY.weaponRange.personal).map(
            (r) => [r, {usable: false, mod: 0}],
        )),
      }),
      weaponSkillType: new fields.StringField({
        choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
      }),
    };
  }

  get damage() {
    if (this.isStrPowered) {
      return this.baseDamage + (this.parent.actor.system.strBonus || 0);
    }

    return this.baseDamage;
  }

  get weaponSkill() {
    return this.parent.actor.items.find((i) => i.type === "skill" && i.system.weaponSkillType === this.weaponSkillType);
  }

  get damageCode() {
    const dmg = this.damage || 0;
    const dmgInitial = this.damageType?.[0] || "";

    const typeString = dmgInitial ? ` (${dmgInitial})` : "";

    return this.isStunWeapon ? `${dmg}F${typeString}` : `${dmg}${typeString}`;
  }
}
