import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/active-effects.mjs";
import {rollTest} from "../helpers/dice.mjs";

export default class MwDestinyHardwareSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mw-destiny", "sheet", "actor"],
      template: "systems/mw-destiny/templates/actor/hardware-sheet.hbs",
      width: 800,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();

    // Add the actor's data to context.data for easier access, as well as flags
    const system = this.actor.system;
    const flags = this.actor.flags;

    // Add global config data
    const MWDESTINY = CONFIG.MWDESTINY;

    // Add roll data for TinyMCE editors
    const rollData = context.actor.getRollData();

    // Prepare active effects
    const effects = prepareActiveEffectCategories(this.actor.effects);

    const tokens = game?.scenes?.current?.tokens;

    if (tokens) {
      const pilots = tokens
          .filter((t) => t.isOwner && (t.actor.type === "pc" || t.actor.type === "npc"))
          .map((t) => ({name: t.name, id: t.actorId}));

      context.pilots = pilots;
    }

    const items = Object.fromEntries(Object.keys(CONFIG.Item.dataModels).map(
        (i) => [i, this.actor.items.filter((k) => k.type === i)],
    ));

    return mergeObject(context, {system, flags, MWDESTINY, rollData, effects, ...items});
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find(".item-create").click(this.#onItemCreate.bind(this));

    // Delete Inventory Item
    html.find(".item-delete").click(this.#onItemDelete.bind(this));

    // Active Effect management
    html.find(".effect-control").click((ev) => onManageActiveEffect(ev, this.actor));

    html.find(".item-field").change((ev) => this.#onItemFieldUpdate(ev));
    html.find(".piloting-test").click((ev) => this.#onPilotingTest(ev));
    html.find(".repair-btn").click((ev) => this.#onRepair(ev));
    html.find(".weapon-attack").click((ev) => this.#onWeaponAttack(ev));
    html.find(".phys-attack").click((ev) => this.#onPhysicalAttack(ev));
  }

  /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
  async #onItemCreate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    // Get the type of item to create.
    const type = element.dataset.type;
    // Grab any data associated with this control.
    const system = duplicate(element.dataset);
    // Initialize a default name.
    const itemName = `${game.i18n.format("MWDESTINY.sheet.newItem", {name: type.capitalize()})}`;
    // Prepare the item object.
    const itemData = {
      name: itemName,
      type,
      system,
    };
      // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  async #onItemDelete(event) {
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));

    const confirmDelete = await Dialog.confirm({
      title: game.i18n.localize("MWDESTINY.dialog.confirmDeleteDialogTitle"),
      content: `<p>${game.i18n.format("MWDESTINY.dialog.confirmDeletePrompt", {name: item.name})}</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    });

    if (!confirmDelete) return;

    item.delete();
    li.slideUp(200, () => this.render(false));
  }

  async #onItemFieldUpdate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    const fieldName = element.dataset.fieldName;
    const newValue = element.value;

    if (fieldName === "name" && !newValue) {
      element.value = item.name;
      return;
    }

    const updates = Object.fromEntries([[fieldName, newValue]]);

    await item.update(updates);
  }

  async #onPilotingTest(event) {
    event.preventDefault();
    const actor = this.actor;
    const pilotData = actor.system.pilot?.system;

    if (!pilotData) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noPilot"));
    }

    const woundPenalty = pilotData.woundPenalty;

    const skill = actor.system.pilotingSkill;

    const skillName = skill?.name || game.i18n.localize("MWDESTINY.mechanic.piloting");
    const skillRank = parseInt(skill?.system?.rank || 0);
    const attr = skill?.system?.link || "rfl";

    const rollLabel = game.i18n.localize("MWDESTINY.mechanic.psr");

    const target = game.user.targets.first();
    const targetName = target.name;

    return await rollTest(actor.getRollData(), rollLabel,
        {actor, attr, skillRank, skillName, woundPenalty, targetName});
  }

  async #onWeaponAttack(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const actor = this.actor;
    const actorData = actor.system;
    const pilot = actorData.pilot;
    const weapon = actor.items.get(itemId);

    if (!weapon) return;

    if (game.user.targets.size !== 1) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noTarget"));
    }

    const woundPenalty = pilot.system.woundPenalty;

    const weaponData = weapon.system;

    const rollLabel = game.i18n.format("MWDESTINY.mechanic.attack", {name: weapon.name});

    const skill = weaponData.weaponSkill;
    const skillName = skill?.name || game.i18n.localize(`MWDESTINY.skills.weapon.${weaponData.weaponSkillType}`);
    const skillData = skill?.system;
    const skillRank = skillData?.rank || 0;
    const attr = skillData?.link || CONFIG.MWDESTINY.weaponSkillLinks[weaponData.weaponSkillType];

    const damageCode = weaponData.damageCode;
    const baseDamage = weaponData.damage;
    const missileCount = weaponData.missileCount;
    const missileMax = weaponData.missileMax;
    const cluster = weaponData.cluster;
    const special = weaponData.special;

    const target = game.user.targets.first();
    const targetName = target.name;
    const targetType = target.actor.type;
    const targetData = target.actor.system;

    const usePiloting = targetType === "hardware" && targetData.hardwareType !== "battleArmor";

    const scaleMod = usePiloting || actorData.hardwareType === "battleArmor" ? 0 : -2;

    const targetPilotData = targetData.pilot?.system;
    const targetRfl = (targetPilotData?.attributes?.rfl ?? targetData?.attributes?.rfl ?? 0);
    const pilotingOrRfl = usePiloting ? targetData?.pilotingSkill?.system?.rank || 0 : targetRfl;

    const targetDefMod = targetRfl + pilotingOrRfl;

    const targetDefLabel = usePiloting ? ": Piloting" : ": RFL+RFL";
    const speedMod = usePiloting ? actorData.movement - targetData.movement : 0;

    return await rollTest(actor.getRollData(), rollLabel,
        {actor, attr, skillRank, skillName, damageCode, woundPenalty, targetName,
          scaleMod, speedMod, targetDefLabel, targetDefMod,
          baseDamage, missileCount, missileMax, cluster, special});
  }

  async #onRepair(event) {
    event.preventDefault();

    const confirmRepair = await Dialog.confirm({
      title: game.i18n.localize("MWDESTINY.dialog.hardwareRepairDialogTitle"),
      content: `<p>${game.i18n.localize("MWDESTINY.dialog.hardwareRepairPrompt")}</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    });

    if (!confirmRepair) return;

    const hp = deepClone(this.actor.system.hp);

    Object.values(hp)
        .forEach((hwType) => Object.values(hwType)
            .forEach((loc) => ["armor", "structure"]
                .forEach((s) => loc[s].value = loc[s].max)));

    await this.actor.update({"system.hp": hp});
  }

  async #onPhysicalAttack(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attackType = element.dataset.attackType;
    const actor = this.actor;
    const actorData = actor.system;

    if (game.user.targets.size !== 1) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noTarget"));
    }

    const woundPenalty = actorData.woundPenalty;

    const attackName = game.i18n.localize(`MWDESTINY.combat.physAttack.${attackType}`);
    const rollLabel = game.i18n.format("MWDESTINY.mechanic.attack", {name: attackName});

    const skill = actorData.pilotingSkill;
    const skillName = skill?.name || game.i18n.localize(`MWDESTINY.skills.piloting.${actorData.pilotingSkillType}`);
    const skillData = skill?.system;
    const skillRank = skillData?.rank || 0;
    const attr = skillData?.link || CONFIG.MWDESTINY.weaponSkillLinks[actorData.pilotingSkillType];

    const baseDamage = actorData.physDamage[attackType];
    const damageCode = `${baseDamage}`;

    const special = CONFIG.MWDESTINY.physAttackInfo[attackType];

    const target = game.user.targets.first();
    const targetName = target.name;
    const targetType = target.actor.type;
    const targetData = target.actor.system;

    const usePiloting = targetType === "hardware" && targetData.hardwareType !== "battleArmor";

    const scaleMod = usePiloting || actorData.hardwareType === "battleArmor" ? 0 : -2;

    const targetPilotData = targetData.pilot?.system;
    const targetRfl = (targetPilotData?.attributes?.rfl ?? targetData?.attributes?.rfl ?? 0);
    const pilotingOrRfl = usePiloting ? targetData?.pilotingSkill?.system?.rank || 0 : targetRfl;

    const targetDefMod = targetRfl + pilotingOrRfl;
    const targetDefLabel = usePiloting ? ": Piloting" : ": RFL+RFL";
    const speedMod = target.type === "hardware" ? actorData.movement - targetData.movement : 0;

    return await rollTest(actor.getRollData(), rollLabel,
        {actor, attr, skillRank, skillName, damageCode, woundPenalty, targetName,
          scaleMod, speedMod, targetDefLabel, targetDefMod,
          baseDamage, special});
  }
}
