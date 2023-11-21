export default class MwDestinyGenericItemData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      content: new fields.StringField(),
    };
  }
}
