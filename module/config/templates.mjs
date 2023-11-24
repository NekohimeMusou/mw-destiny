export default async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/mw-destiny/templates/actor/parts/header.hbs",
    "systems/mw-destiny/templates/actor/parts/tab-main.hbs",
    "systems/mw-destiny/templates/actor/parts/tab-history.hbs",
    "systems/mw-destiny/templates/actor/parts/tab-personality.hbs",
    "systems/mw-destiny/templates/actor/parts/tab-cues.hbs",
    "systems/mw-destiny/templates/actor/parts/attributes-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/skills-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/weapons-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/cues-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/dispositions-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/equipment-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/life-modules-pane.hbs",
    "systems/mw-destiny/templates/item/parts/header.hbs",
    "systems/mw-destiny/templates/item/parts/item-weapon-main.hbs",
    "systems/mw-destiny/templates/item/parts/item-heavy-weapon-main.hbs",
  ];

  return loadTemplates(templatePaths);
}
