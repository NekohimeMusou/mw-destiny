import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/active-effects.mjs";

export default class MwDestinyItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mw-destiny", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
    });
  }

  /** @override */
  get template() {
    const basePath = "systems/mw-destiny/templates/item";

    return `${basePath}/item-${this.item.type}-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();

    const itemData = this.item.toObject(false);

    const system = itemData.system;
    const flags = itemData.flags;
    const rollData = this.item.getRollData() || {};
    const effects = prepareActiveEffectCategories(this.item.effects);
    const MWDESTINY = CONFIG.MWDESTINY;

    Object.assign(context,
        {system, flags, rollData, effects, MWDESTINY});

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.find(".effect-control").click((ev) => onManageActiveEffect(ev, this.item));
  }
}
