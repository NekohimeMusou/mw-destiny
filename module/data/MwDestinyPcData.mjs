import getSharedActorData from "./shared-actor-data.mjs";
import getSharedCharacterData from "./shared-character-data.mjs";
export default class MwDestinyPcData extends foundry.abstract.DataModel {
  /** @inheritdoc */
  static defineSchema() {
    const fields = foundry.data.fields;

    const attributes = new fields.SchemaField(
        Object.fromEntries(
            Object.keys(CONFIG.MWDESTINY.attributes.pc).map(
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
      ...getSharedActorData(),
      ...getSharedCharacterData(),
      attributes,
      history: new fields.HTMLField(),
      personality: new fields.HTMLField(),
      lifeModules: new fields.SchemaField(Object.fromEntries(
          CONFIG.MWDESTINY.lifeModuleStages.map(
              (m) => [m, new fields.StringField({required: true})],
          ),
      )),
      cues: new fields.ArrayField(new fields.StringField(), {
        required: true,
        initial: Array(20).fill(""),
      }),
      dispositions: new fields.ArrayField(new fields.StringField(), {
        required: true,
        initial: Array(4).fill(""),
      }),
      traits: new fields.ArrayField(new fields.StringField(), {
        required: true,
        initial: Array(2).fill(""),
      }),
      hasToughnessTrait: new fields.BooleanField(),
      hasUnluckyTrait: new fields.BooleanField(),
    };
  }

  get strBonus() {
    if (this.attributes.str < 3) return 0;
    if (this.attributes.str < 5) return 1;
    return 2;
  }

  get woundPenalty() {
    if (this.ignoreWoundPenalty) return 0;
    let total = 0;

    for (const [hpPool, attr] of [["physDamage", "str"], ["fatigueDamage", "wil"]]) {
      const current = this[hpPool].value;
      const max = this[hpPool].max;

      if (current === max || current > 11 || (current === 11 && this.attributes[attr] < 4)) {
        continue;
      } else if (current > 8) {
        total -= 1;
      } else if (current > 5) {
        total -= 2;
      } else if (current > 2) {
        total -= 3;
      } else {
        total -= 4;
      }
    }

    return total;
  }
}
