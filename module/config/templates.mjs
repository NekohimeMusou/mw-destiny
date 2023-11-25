export default async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/mw-destiny/templates/parts/pc/header.hbs",
    "systems/mw-destiny/templates/parts/pc/tab-main.hbs",
    "systems/mw-destiny/templates/parts/pc/tab-history.hbs",
    "systems/mw-destiny/templates/parts/pc/tab-personality.hbs",
    "systems/mw-destiny/templates/parts/pc/tab-cues.hbs",
    "systems/mw-destiny/templates/parts/pc/attributes-pane.hbs",
    "systems/mw-destiny/templates/parts/pc/skills-pane.hbs",
    "systems/mw-destiny/templates/parts/pc/weapons-pane.hbs",
    "systems/mw-destiny/templates/parts/pc/cues-pane.hbs",
    "systems/mw-destiny/templates/parts/pc/dispositions-pane.hbs",
    "systems/mw-destiny/templates/parts/pc/life-modules-pane.hbs",
    "systems/mw-destiny/templates/parts/hardware/header.hbs",
    "systems/mw-destiny/templates/parts/hardware/tab-main.hbs",
    "systems/mw-destiny/templates/parts/hardware/armor-pane.hbs",
    "systems/mw-destiny/templates/parts/hardware/vital-stats-pane.hbs",
    "systems/mw-destiny/templates/parts/hardware/weapons-pane.hbs",
    "systems/mw-destiny/templates/parts/shared/equipment-pane.hbs",
    "systems/mw-destiny/templates/parts/shared/tags-pane.hbs",
    "systems/mw-destiny/templates/parts/shared/tab-description.hbs",
    "systems/mw-destiny/templates/parts/item/header.hbs",
    "systems/mw-destiny/templates/parts/item/item-weapon-main.hbs",
    "systems/mw-destiny/templates/parts/item/item-heavy-weapon-main.hbs",
  ];

  return loadTemplates(templatePaths);
}
