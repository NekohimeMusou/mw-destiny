import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/active-effects.mjs";
import {rollTest} from "../helpers/dice.mjs";

export default class MwDestinyPcSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mw-destiny", "sheet", "actor"],
      template: "systems/mw-destiny/templates/actor/pc-sheet.hbs",
      width: 800,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();

    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags
    const system = actorData.system;
    const flags = actorData.flags;

    // Add global config data
    const MWDESTINY = CONFIG.MWDESTINY;

    // Add roll data for TinyMCE editors
    const rollData = context.actor.getRollData();

    // Prepare active effects
    const effects = prepareActiveEffectCategories(this.actor.effects);

    const skills = context.items.filter((i) => i.type === "skill");

    const weapons = context.items.filter((i) => i.type === "weapon");

    // TODO: Try foundry.utils.mergeObject
    foundry.utils.mergeObject(context, {
      system, flags, rollData, effects, skills, weapons, MWDESTINY,
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
    const damageCode = dataset.damageCode;

    return await rollTest(this.actor.getRollData(), dataset.rollLabel, {attr, skillRank, skillName, damageCode});
  }
}
