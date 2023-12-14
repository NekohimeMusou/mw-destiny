export async function rollTest(rollData, title, {actor=null, attr=null, skillRank=null,
  skillName=null, damageCode=null, woundPenalty=0, targetDefLabel="", targetDefMod=0, targetName=null, scaleMod=0, speedMod=0}={}) {
  const {mod, difficulty, term2, attr2, cancelled} = await showRollDialog(title, {attr, skillRank, skillName, targetName});

  if (cancelled) return;

  const isWeaponAttack = damageCode != null;

  const rollFormula = `2d6 + @${attr} + ${term2} + ${woundPenalty} + ${scaleMod} + ${speedMod} + ${mod}`;

  const playerRoll = await new Roll(rollFormula, rollData).roll({async: true});

  // If difficulty is null, return the roll by itself
  // If not, roll the difficulty dice
  const rolls = [playerRoll];

  const parts = [];

  const titleSuffix = isWeaponAttack ? "Test" : "Attack";

  const flavor = skillName ? `${skillName} ${titleSuffix}` : `${attr2?.toUpperCase()} + ${attr2?.toUpperCase()} ${titleSuffix}`;

  parts.push(`<p>${attr.toUpperCase()} + ${skillName || attr2?.toUpperCase()}</p>`);

  if (targetName) {
    parts.push(`<h3>${game.i18n.localize("MWDESTINY.mechanic.target")}: ${targetName}</h3>`);
  }

  if (difficulty || isWeaponAttack) {
    const difficultyDice = CONFIG.MWDESTINY.rollDifficultyDice?.[difficulty] || `2d6 + ${targetDefMod}`;

    const difficultyRoll = await new Roll(difficultyDice, rollData).roll({async: true});

    const success = playerRoll.total >= difficultyRoll.total;

    const damageMsg = isWeaponAttack && success ? `<p>Damage: ${damageCode}</p>` : "";

    const successStr = isWeaponAttack ? game.i18n.localize("MWDESTINY.dice.hit") : game.i18n.localize("MWDESTINY.dice.success");
    const failureStr = isWeaponAttack ? game.i18n.localize("MWDESTINY.dice.miss") : game.i18n.localize("MWDESTINY.dice.failure");
    const successMsg = `<h3>${success ? `${successStr}!` : `${failureStr}!`}</h3>`;

    const playerLabel = `<p>${actor.name}</p>`;
    const oppositionLabel = targetName ? `<p>${targetName}${targetDefLabel}</p>` :
    `<p>${game.i18n.localize("MWDESTINY.mechanic.difficulty")}: ${game.i18n.localize(`MWDESTINY.dialog.difficulties.${difficulty}`)}`;

    parts.push(successMsg, damageMsg, playerLabel, await playerRoll.render(), oppositionLabel, await difficultyRoll.render());
  } else {
    parts.push(await playerRoll.render());
  }

  const content = `<div class="flexcol">\n${parts.join("\n")}\n</div>`;

  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor}),
    rolls,
    content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor,
  };

  return await ChatMessage.create(chatData);
}

// Return the 2nd term directly: "0" or "@[stat]" or the skill ranks
async function showRollDialog(title, {attr=null, skillRank=null, skillName=null, targetName=null}={}) {
  async function _processRollOptions(form) {
    // If skillRank is 0/empty AND attr2 is empty, it's an unskilled roll
    // If skillRank > 0, it's a skill roll: return the skill ranks as an int
    // If attr2 exists, it's an attribute roll; return "@[attr]"
    const attr2 = form.attr2?.value;
    const term2 = attr2 ? `@${attr2}` : `${parseInt(skillRank || 0)}`;
    return {
      mod: parseInt(form.mod.value || 0),
      difficulty: form.difficulty?.value,
      term2,
      attr2,
    };
  }

  const template = "systems/mw-destiny/templates/dialog/roll-dialog.hbs";
  const content = await renderTemplate(template, {title, attr, skillRank, skillName, targetName, MWDESTINY: CONFIG.MWDESTINY});

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
