// Import data model classes
import MwDestinyActorData from "./data/MwDestinyActorData.mjs";
import MwDestinyItemData from "./data/MwDestinyItemData.mjs";
// Import document classes
import MwDestinyActor from "./document/MwDestinyActor.mjs";
import MwDestinyItem from "./document/MwDestinyItem.mjs";
// Import sheet classes
import MwDestinyActorSheet from "./sheet/MwDestinyActorSheet.mjs";
import MwDestinyItemSheet from "./sheet/MwDestinyItemSheet.mjs";
// Import helper/utility classes and constants
import {MWDESTINY} from "./config/config.mjs";
import preloadHandlebarsTemplates from "./config/templates.mjs";


Hooks.once("init", async function() {
  console.log("MWDESTINY | Initializing MechWarrior: Destiny game system");
  // Add utility classes to global object
  game.mwdestiny = {
    MwDestinyActor,
    MwDestinyItem,
  };

  // Add custom config constants
  CONFIG.MWDESTINY = MWDESTINY;

  registerDataModels();
  registerDocumentClasses();
  registerSheetApplications();
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
});

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = MwDestinyActor;
  CONFIG.Item.documentClass = MwDestinyItem;
}

function registerDataModels() {
  CONFIG.Actor.dataModels.pc = MwDestinyActorData;
  CONFIG.Item.dataModels.skill = MwDestinyItemData;
  CONFIG.Item.dataModels.trait = MwDestinyItemData;
}

function registerSheetApplications() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mw-destiny", MwDestinyActorSheet, {makeDefault: true});
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mw-destiny", MwDestinyItemSheet, {makeDefault: true});
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("caps", (str) => str.toUpperCase?.() || str);
}
