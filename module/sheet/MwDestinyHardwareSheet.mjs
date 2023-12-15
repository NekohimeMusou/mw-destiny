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

    const ownedPcs = game.actors.filter((a) => a.type === "pc" && a.isOwner);

    const items = Object.fromEntries(Object.keys(CONFIG.Item.dataModels).map(
        (i) => [i, this.actor.items.filter((k) => k.type === i)],
    ));

    return mergeObject(context, {system, flags, MWDESTINY, rollData, effects, ownedPcs, ...items});
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

    html.find(".roll-test").click((ev) => this.#onSheetRoll(ev));
    html.find(".repair-btn").click((ev) => this.#onRepair(ev));
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
    const itemName = `New ${type.capitalize()}`;
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
      title: "Delete Item",
      content: `<p>Really delete ${item.name}?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    });

    if (!confirmDelete) return;

    item.delete();
    li.slideUp(200, () => this.render(false));
  }

  async #onSheetRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const skillRank = parseInt(dataset.skillRank || 0);
    const attr = dataset.attr;
    const skillName = dataset.skillName;
    const damageCode = dataset.damageCode;
    const woundPenalty = this.actor.system.pilot?.system.woundPenalty;
    const actor = this.actor;

    if (actor.type === "hardware" && !actor.system.pilotId) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noPilot"));
    }
    if (damageCode != null && game.user.targets.size !== 1) {
      return ui.notifications.notify(game.i18n.localize("MWDESTINY.notifications.noTarget"));
    }

    const target = game.user.targets.first().actor;

    const targetName = target?.name;

    const targetType = target?.type;

    const scaleMod = damageCode != null && targetType !== "hardware" ? 2 : 0;

    const speedMod = target.type !== "hardware" ? 0 : this.actor.system.movement - target.system.movement;

    let targetDefMod = 0;
    if (targetType === "hardware") {
      targetDefMod += target.system.pilot?.system?.attributes?.rfl || 0;
      targetDefMod += target.system.pilotingSkill?.system?.rank || 0;
    } else if (targetType) {
      targetDefMod += target.system.attributes.rfl * 2;
    }

    let targetDefLabel = "";

    if (target && damageCode) {
      targetDefLabel = targetType === "hardware" ? ": Piloting" : ": RFL+RFL";
    }

    return await rollTest(this.actor.getRollData(), dataset.rollLabel,
        {actor, attr, skillRank, skillName, damageCode, woundPenalty, targetName, scaleMod, speedMod, targetDefLabel, targetDefMod});
  }

  async #onRepair(event) {
    event.preventDefault();

    const confirmRepair = await Dialog.confirm({
      title: "Delete Item",
      content: "<p>Repair hardware armor and structure?</p>",
      yes: () => true,
      no: () => false,
      defaultYes: false,
    });

    if (!confirmRepair) return;

    const hp = deepClone(this.actor.system.hp);

    for (const hwType of Object.values(hp)) {
      for (const loc of Object.values(hwType)) {
        ["armor", "structure"].forEach((s) => loc[s].value = loc[s].max);
      }
    }

    await this.actor.update({"system.hp": hp});
  }
}
