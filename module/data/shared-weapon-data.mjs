export default function getSharedWeaponData(weaponType) {
  const fields = foundry.data.fields;

  return {
    baseDamage: new fields.NumberField({integer: true}),
    damageType: new fields.StringField(),
    range: new fields.ObjectField({
      initial: Object.fromEntries(Object.keys(CONFIG.MWDESTINY.weaponRange[weaponType]).map(
          (r) => [r, {usable: false, mod: null}],
      )),
    }),
    special: new fields.StringField(),
  };
}
