import getSharedItemData from "./shared-item-data.mjs";
import getSharedWeaponData from "./shared-weapon-data.mjs";
export default class MwDestinyWeaponData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;
    const weaponType = "personal";

    return {
      ...getSharedItemData(),
      ...getSharedWeaponData(weaponType),
      isStunWeapon: new fields.BooleanField({
        initial: false,
      }),
      isStrPowered: new fields.BooleanField({
        initial: false,
      }),
      weaponSkillType: new fields.StringField({
        required: true,
        choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
        initial: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes)[0],
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
    return this.parent.actor.items.find((i) => i.type === "skill" &&
      i.system.weaponSkillType === this.weaponSkillType);
  }

  get damageCode() {
    const dmg = this.damage || 0;

    const dmgInitial = this.damageType?.[0]?.toUpperCase() || "";

    const typeString = dmgInitial ? ` (${dmgInitial})` : "";

    return this.isStunWeapon ? `${dmg}F${typeString}` : `${dmg}${typeString}`;
  }
}
