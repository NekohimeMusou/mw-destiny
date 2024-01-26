// Import data model classes
import MwDestinyPcData from "./data/MwDestinyPcData.mjs";
import MwDestinyNpcData from "./data/MwDestinyNpcData.mjs";
import MwDestinyAnimalData from "./data/MwDestinyAnimalData.mjs";
import MwDestinySkillData from "./data/MwDestinySkillData.mjs";
import MwDestinyWeaponData from "./data/MwDestinyWeaponData.mjs";
import MwDestinyHardwareData from "./data/MwDestinyHardwareData.mjs";
import MwDestinyHeavyWeaponData from "./data/MwDestinyHeavyWeaponData.mjs";
// Import document classes
import MwDestinyActor from "./document/MwDestinyActor.mjs";
import MwDestinyItem from "./document/MwDestinyItem.mjs";
// Import sheet classes
import MwDestinyPcSheet from "./sheet/MwDestinyPcSheet.mjs";
import MwDestinyHardwareSheet from "./sheet/MwDestinyHardwareSheet.mjs";
import MwDestinyItemSheet from "./sheet/MwDestinyItemSheet.mjs";
// Import helper/utility classes and constants
import {MWDESTINY} from "./config/config.mjs";
import preloadHandlebarsTemplates from "./config/templates.mjs";
// Import hooks
import registerHooks from "./helpers/hooks.mjs";

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
  registerHooks();
  initializeStatusEffects();
  preloadHandlebarsTemplates();
});

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = MwDestinyActor;
  CONFIG.Item.documentClass = MwDestinyItem;
}

function registerDataModels() {
  CONFIG.Actor.dataModels.pc = MwDestinyPcData;
  CONFIG.Actor.dataModels.npc = MwDestinyNpcData;
  CONFIG.Actor.dataModels.animal = MwDestinyAnimalData;
  CONFIG.Actor.dataModels.hardware = MwDestinyHardwareData;
  CONFIG.Item.dataModels.skill = MwDestinySkillData;
  CONFIG.Item.dataModels.weapon = MwDestinyWeaponData;
  CONFIG.Item.dataModels.heavyWeapon = MwDestinyHeavyWeaponData;
}

function registerSheetApplications() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mw-destiny", MwDestinyPcSheet, {types: ["pc", "npc", "animal"], makeDefault: true});
  Actors.registerSheet("mw-destiny", MwDestinyHardwareSheet, {types: ["hardware"], makeDefault: true});
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mw-destiny", MwDestinyItemSheet, {makeDefault: true});
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("caps", (str) => str.toUpperCase?.() || str);
}

function initializeStatusEffects() {
  CONFIG.statusEffects = CONFIG.statusEffects.concat(CONFIG.MWDESTINY.statusEffects);
}
