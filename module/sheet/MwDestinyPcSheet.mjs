import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/active-effects.mjs";
import {rollTest} from "../helpers/dice.mjs";

export default class MwDestinyPcSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mw-destiny", "sheet", "actor"],
      template: "systems/mw-destiny/templates/actor/pc-sheet.hbs",
      width: 800,
      height: 800,
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

    const items = Object.fromEntries(Object.keys(CONFIG.Item.dataModels).map(
        (i) => [i, this.actor.items.filter((k) => k.type === i)],
    ));

    foundry.utils.mergeObject(context, {
      system, flags, rollData, effects, ...items, MWDESTINY,
    });

    return context;
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
    html.find(".item-delete").click((ev) => this.#onItemDelete(ev));

    // Active Effect management
    html.find(".effect-control").click((ev) => onManageActiveEffect(ev, this.actor));

    // Skills pane
    html.find(".item-link-select").change((ev) => this.#onItemLinkSelect(ev));
    html.find(".item-field").change((ev) => this.#onItemFieldUpdate(ev));
    html.find(".roll-test").click((ev) => this.#onSheetRoll(ev));
    html.find(".weapon-attack").click((ev) => this.#onWeaponAttack(ev));
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

  async #onItemLinkSelect(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    await item.update({"system.link": element.value});
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

  async #onSheetRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const skillRank = parseInt(dataset.skillRank || 0);
    const attr = dataset.attr;
    const skillName = dataset.skillName;
    const woundPenalty = this.actor.system.woundPenalty;
    const actor = this.actor;

    const target = game.user.targets.first();
    const targetName = target?.name;

    return await rollTest(this.actor.getRollData(), dataset.rollLabel,
        {actor, attr, skillRank, skillName, woundPenalty, targetName});
  }

  async #onWeaponAttack(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item").dataset.itemId;
    const actor = this.actor;
    const actorData = actor.system;
    const weapon = actor.items.get(itemId);

    if (!weapon) return;

    if (game.user.targets.size !== 1) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noTarget"));
    }

    const weaponData = weapon.system;

    const skill = weaponData.weaponSkill;
    const skillName = skill?.name || game.i18n.localize(`MWDESTINY.skills.weapon.${weaponData.weaponSkillType}`);
    const skillData = skill?.system;
    const skillRank = skillData?.rank || 0;
    const attr = skillData?.link || CONFIG.MWDESTINY.weaponSkillLinks[weaponData.weaponSkillType];

    const damageCode = weaponData.damageCode;
    const baseDamage = weaponData.damage;
    const special = weaponData.special;

    const woundPenalty = actorData.woundPenalty;

    const target = game.user.targets.first();
    const targetName = target.name;
    const targetType = target.actor.type;
    const targetData = target.actor.system;

    const usePiloting = targetType === "hardware" && targetData.hardwareType !== "battleArmor";

    const scaleMod = usePiloting ? 2 : 0;

    const targetPilotData = targetData?.pilot?.system;

    const targetRfl = (targetPilotData?.attributes?.rfl ?? targetData?.attributes?.rfl ?? 0);
    const pilotingOrRfl = usePiloting ? targetData?.pilotingSkill?.system?.rank || 0 : targetRfl;

    const targetDefMod = targetRfl + pilotingOrRfl;

    const targetDefLabel = usePiloting ? ": Piloting" : ": RFL+RFL";

    const rollLabel = game.i18n.format("MWDESTINY.mechanic.attack", {name: weapon.name});

    return await rollTest(this.actor.getRollData(), rollLabel,
        {actor, attr, skillRank, skillName, damageCode, woundPenalty,
          targetDefLabel, targetDefMod, targetName, scaleMod, baseDamage, special});
  }
}
