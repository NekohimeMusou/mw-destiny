export async function rollTest(rollData, title, attr1, skillRank) {
  const {mod, difficulty, term2, cancelled} = await showRollDialog(title);

  if (cancelled) return;

  const rollFormula = `2d6 + @${attr1} + ${term2} + ${mod || 0}`;

  const roll = await new Roll(rollFormula, rollData).roll({async: true});

  const total = roll.total;
}

// Return the 2nd term directly: "0" or "@[stat]" or the skill ranks
async function showRollDialog(title, {attr1=null, skillRank=null}={}) {
  async function _processRollOptions(form) {
    // If skillRank is 0/empty AND attr2 is empty, it's an unskilled roll
    // If skillRank > 0, it's a skill roll: return the skill ranks as an int
    // If attr2 exists, it's an attribute roll; return "@[attr]"
    const term2 = form.attr2.value ? `@${form.attr2.value}` : `${form.skillRank.value || 0}`;
    return {
      mod: parseInt(form.mod.value || 0),
      difficulty: form.difficulty.value,
      term2,
    };
  }

  const template = "systems/mw-destiny/templates/dialog/roll-dialog.hbs";
  const content = await renderTemplate(template, {title, attr1, skillRank, MWDESTINY: CONFIG.MWDESTINY});

  return new Promise((resolve) => new Dialog({
    title,
    content,
    buttons: {
      roll: {
        label: "Roll",
        callback: (html) => resolve(_processRollOptions(html[0].querySelector("form"))),
      },
      cancel: {
        label: "Cancel",
        callback: () => resolve({cancelled: true}),
      },
    },
    default: "roll",
    close: () => resolve({cancelled: true}),
  }, null).render(true));
}
