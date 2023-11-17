export default async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/mw-destiny/templates/actor/parts/header.hbs",
    "systems/mw-destiny/templates/actor/parts/tab-main.hbs",
    "systems/mw-destiny/templates/actor/parts/attributes-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/skills-pane.hbs",
    "systems/mw-destiny/templates/actor/parts/weapons-pane.hbs",
    "systems/mw-destiny/templates/item/parts/header.hbs",
    "systems/mw-destiny/templates/item/parts/item-weapon-main.hbs",
    "systems/mw-destiny/templates/item/parts/item-heavy-weapon-main.hbs",
  ];

  return loadTemplates(templatePaths);
}
