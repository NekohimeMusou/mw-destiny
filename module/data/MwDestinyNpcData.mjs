import getSharedCharacterData from "./shared-person-data.mjs";
export default class MwDestinyNpcData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const attributes = new fields.SchemaField(
        Object.fromEntries(
            Object.keys(CONFIG.MWDESTINY.attributes.npc).map(
                (a) => [a,
                  new fields.NumberField({
                    initial: 1,
                    integer: true,
                    positive: true,
                  }),
                ],
            ),
        ));

    return {
      ...getSharedCharacterData(),
      attributes,
    };
  }
}
