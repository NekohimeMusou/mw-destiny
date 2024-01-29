import getSharedActorData from "./shared-actor-data.mjs";
import getSharedCharacterData from "./shared-character-data.mjs";
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
      ...getSharedActorData(),
      ...getSharedCharacterData(),
      attributes,
    };
  }

  get strBonus() {
    if (this.attributes.str < 3) return 0;
    if (this.attributes.str < 5) return 1;
    return 2;
  }

  get physWoundPenalty() {
    if (this.ignoreWoundPenalty) return 0;

    return this.#calculateWoundPenalty(this.physDamage.value, this.physDamage.max, this.attributes.str);
  }

  get fatigueWoundPenalty() {
    if (this.ignoreWoundPenalty) return 0;

    return this.#calculateWoundPenalty(this.fatigueDamage.value, this.fatigueDamage.max, this.attributes.wil);
  }

  get woundPenalty() {
    return this.physWoundPenalty + this.fatigueWoundPenalty;
  }

  get conCheckTn() {
    if (this.physDamage.value === 1) {
      return 11;
    }

    switch (this.physWoundPenalty) {
      case -1:
        return 3;
      case -2:
        return 5;
      case -3:
        return 7;
      case -4:
        return 10;
      default:
        return 0;
    }
  }

  #calculateWoundPenalty(currentHp, maxHp, attr) {
    if (currentHp === maxHp || currentHp > 11 || (currentHp === 11 && attr < 4)) {
      return 0;
    } else if (currentHp > 8) {
      return -1;
    } else if (currentHp > 5) {
      return -2;
    } else if (currentHp > 2) {
      return -3;
    } else {
      return -4;
    }
  }
}
