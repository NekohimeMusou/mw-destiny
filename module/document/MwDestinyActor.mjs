export default class MwDestinyActor extends Actor {
  /** @inheritdoc */
  prepareData() {
    super.prepareData();
  }

  /** @inheritdoc */
  getRollData() {
    const data = foundry.utils.deepClone(super.getRollData());

    for (const [k, v] of Object.entries(data.attributes)) {
      data[k] = v;
    }

    return data;
  }
}
