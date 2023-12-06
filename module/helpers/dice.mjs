export async function sheetRoll(rollData, {attr: attr1=null, skill=null, weapon=null}={}) {
  if (game.user.targets.size > 1) {
    ui.notifications.warn("Please only target one thing.");
    return;
  }

  const target = game.user.targets.first();

  const dialogLabel = weapon?.name || skill?.name || attr1.toUpperCase();
  const dialogTitle = `${dialogLabel} ${weapon ? "Attack" : "Test"}`;

  const {difficulty, mod, term2, attr2, cancelled} = await showTestDialog(dialogTitle, {attr1, skill, target});

  if (cancelled) return;

  const template = "systems/mw-destiny/templates/chat/roll-result.hbs";

  // If we got a 2nd attribute, use that for the card title; otherwise use the same one as the dialog
  const cardTitle = attr2 ? `${attr1.toUpperCase()} + ${attr2.toUpperCase()} Test` : dialogTitle;

  // PC Roll Name (e.g. "RFL + Melee Combat")
  // RENDER PC ROLL
  // Opposition Roll Name (e.g. "Difficulty" or "OpponentName: RFL + RFL")
  // RENDER OPPOSITION ROLL (button, replace when clicked?)
  // Success/Failure
  // Damage
}

async function showTestDialog(title, {attr1=null, skill=null, target=null}={}) {
  async function _processRollOptions(form) {
    const attr2 = form.attr2?.value;
    const term2 = attr2 ? `@${attr2}` : parseInt(skillRank || 0);
    return {
      mod: parseInt(form.mod.value) || 0,
      difficulty: form.difficulty.value,
      attr2,
      term2,
    };
  }

  const skillName = skill?.name;
  const skillRank = skill?.system?.rank;
  const template = "systems/mw-destiny/templates/dialog/roll-dialog.hbs";

  const content = await renderTemplate(template, {attr1, skillName, skillRank, target});

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

export async function rollTest(rollData, title, {attr=null, skillRank=null, skillName=null, damageCode=null}={}) {
  const {mod, difficulty, term2, attr2, cancelled} = await showRollDialog(title, {attr, skillRank, skillName});

  // TODO: Fix this so the roll chat output shows like "INT + INT" or "INT + RFL" or w/e
  if (cancelled) return;

  const rollFormula = `2d6 + @${attr} + ${term2} + ${mod}`;

  const playerRoll = await new Roll(rollFormula, rollData).roll({async: true});

  // If difficulty is null, return the roll by itself
  // If not, roll the difficulty dice
  const rolls = [playerRoll];

  const parts = [];

  parts.push(`<p>${attr.toUpperCase()} + ${skillName || attr2?.toUpperCase()}</p>`);

  if (damageCode) {
    parts.push(`<h3>Damage: ${damageCode}</h3>`);
  }

  if (difficulty) {
    const difficultyDice = `${CONFIG.MWDESTINY.rollDifficultyDice?.[difficulty] || "3d6"}`;

    const difficultyRoll = await new Roll(difficultyDice, rollData).roll({async: true});

    const successMsg = `<h3>${playerRoll.total >= difficultyRoll.total ? "Success!" : "Failure!"}</h3>`;

    const totalMsg = `<h3>${playerRoll.total} vs. ${difficultyRoll.total}</h3>`;

    parts.push(successMsg, totalMsg, await playerRoll.render(), await difficultyRoll.render());
  } else {
    parts.push(await playerRoll.render());
  }

  const content = `<div class="flexcol">\n${parts.join("\n")}\n</div>`;

  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    rolls,
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor: title,
  };

  return await ChatMessage.create(chatData);
}

