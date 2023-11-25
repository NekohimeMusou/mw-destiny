export default class MwDestinyActor extends Actor {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @inheritdoc */
  getRollData() {
    const rollData = foundry.utils.deepClone(super.getRollData());

    if (rollData.attributes) {
      foundry.utils.mergeObject(rollData, rollData.attributes);
    }

    return rollData;
  }
}
