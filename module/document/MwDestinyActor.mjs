export default class MwDestinyActor extends Actor {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @inheritdoc */
  getRollData() {
    const rollData = foundry.utils.deepClone(super.getRollData());

    const attributes = rollData.attributes || this.system?.pilot.system.attributes;
    if (attributes) {
      foundry.utils.mergeObject(rollData, attributes);
    }

    return rollData;
  }
}
