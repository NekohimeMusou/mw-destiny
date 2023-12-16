export default function getSharedItemData() {
  const fields = foundry.data.fields;

  return {
    description: new fields.HTMLField(),
    weaponSkillType: new fields.StringField({
      required: true,
      choices: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes),
      initial: Object.keys(CONFIG.MWDESTINY.weaponSkillTypes)[0],
    }),
  };
}
