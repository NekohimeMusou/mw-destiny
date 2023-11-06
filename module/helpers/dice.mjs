/**
 * @argument rollData: Roll Data
 * @argument title: Window title (e.g. "Attribute Roll", "[Skill] Roll")
 */
export async function rollTest(rollData, title, attr1, skillRank) {
  const {mod, difficulty, attr2, cancelled} = await showRollDialog(title, attr1);

  if (cancelled) return;


}

async function showRollDialog(title) {
  async function _processRollOptions(form) {
    return {};
  }

  const template = "systems/mw-destiny/templates/dialog/roll-dialog.hbs";
  const content = await renderTemplate(template);

  return {};
}
