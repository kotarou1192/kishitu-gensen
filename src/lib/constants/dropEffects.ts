export type BaseEffect = "敏捷UP" | "筋力UP" | "意志UP" | "知性UP" | "メイン能力UP";

export type AdditionalEffect =
  | "攻撃力UP"
  | "HPアップ"
  | "物理ダメージUP"
  | "灼熱ダメージUP"
  | "電磁ダメージUP"
  | "寒冷ダメージUP"
  | "自然ダメージUP"
  | "会心率UP"
  | "アーツ強度UP"
  | "必殺技効率UP"
  | "アーツダメージUP"
  | "回復効率UP";

export type SkillEffect =
  | "強攻"
  | "圧制"
  | "追襲"
  | "破砕"
  | "巧技"
  | "噴発"
  | "流回"
  | "効率"
  | "昂揚"
  | "付術"
  | "治癒"
  | "切骨"
  | "残虐"
  | "夜幕";

export type BaseEffectEn =
  | "Agility UP"
  | "Strength UP"
  | "Will UP"
  | "Intelligence UP"
  | "Main Ability UP";

export type AdditionalEffectEn =
  | "Attack UP"
  | "HP UP"
  | "Physical Damage UP"
  | "Fire Damage UP"
  | "Electric Damage UP"
  | "Cold Damage UP"
  | "Nature Damage UP"
  | "Critical Rate UP"
  | "Arts Power UP"
  | "Finisher Efficiency UP"
  | "Arts Damage UP"
  | "Healing Efficiency UP";

export type SkillEffectEn =
  | "Assault"
  | "Domination"
  | "Pursuit"
  | "Crush"
  | "Skillful"
  | "Eruption"
  | "Circulation"
  | "Efficiency"
  | "Exaltation"
  | "Enchantment"
  | "Healing"
  | "Bonecut"
  | "Brutality"
  | "Nightfall";

export type AreaKey =
  | "central_area"
  | "originium_park"
  | "mine_area"
  | "energy_highland"
  | "wuling_city"
  | "qingbo_fort";

export type AreaJa =
  | "中枢エリア"
  | "源石研究パーク"
  | "鉱山エリア"
  | "エネルギー高地"
  | "武陵城"
  | "清波砦";

export type AreaEn =
  | "Central Area"
  | "Originium Park"
  | "Mine Area"
  | "Energy Highland"
  | "Wuling City"
  | "Qingbo Fort";

export type BaseEffectI18n = {
  ja: BaseEffect;
  en: BaseEffectEn;
};

export type AdditionalEffectI18n = {
  ja: AdditionalEffect;
  en: AdditionalEffectEn;
};

export type SkillEffectI18n = {
  ja: SkillEffect;
  en: SkillEffectEn;
};

export type AreaI18nByKey = {
  central_area: { ja: "中枢エリア"; en: "Central Area" };
  originium_park: { ja: "源石研究パーク"; en: "Originium Park" };
  mine_area: { ja: "鉱山エリア"; en: "Mine Area" };
  energy_highland: { ja: "エネルギー高地"; en: "Energy Highland" };
  wuling_city: { ja: "武陵城"; en: "Wuling City" };
  qingbo_fort: { ja: "清波砦"; en: "Qingbo Fort" };
};

export type AreaI18n = AreaI18nByKey[AreaKey];

export type DropEffectI18n = {
  base: BaseEffectI18n[];
  additional: AdditionalEffectI18n[];
  skill: SkillEffectI18n[];
};

export type DropEffectsI18n = {
  [K in AreaKey]: {
    area: AreaI18nByKey[K];
    effects: DropEffectI18n;
  };
};

export const DROP_EFFECTS: DropEffectsI18n = {
  central_area: {
    area: { ja: "中枢エリア", en: "Central Area" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "攻撃力UP", en: "Attack UP" },
        { ja: "灼熱ダメージUP", en: "Fire Damage UP" },
        { ja: "電磁ダメージUP", en: "Electric Damage UP" },
        { ja: "寒冷ダメージUP", en: "Cold Damage UP" },
        { ja: "自然ダメージUP", en: "Nature Damage UP" },
        { ja: "アーツ強度UP", en: "Arts Power UP" },
        { ja: "必殺技効率UP", en: "Finisher Efficiency UP" },
        { ja: "アーツダメージUP", en: "Arts Damage UP" },
      ],
      skill: [
        { ja: "強攻", en: "Assault" },
        { ja: "圧制", en: "Domination" },
        { ja: "追襲", en: "Pursuit" },
        { ja: "破砕", en: "Crush" },
        { ja: "巧技", en: "Skillful" },
        { ja: "噴発", en: "Eruption" },
        { ja: "流回", en: "Circulation" },
        { ja: "効率", en: "Efficiency" },
      ],
    },
  },
  originium_park: {
    area: { ja: "源石研究パーク", en: "Originium Park" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "攻撃力UP", en: "Attack UP" },
        { ja: "物理ダメージUP", en: "Physical Damage UP" },
        { ja: "電磁ダメージUP", en: "Electric Damage UP" },
        { ja: "寒冷ダメージUP", en: "Cold Damage UP" },
        { ja: "自然ダメージUP", en: "Nature Damage UP" },
        { ja: "会心率UP", en: "Critical Rate UP" },
        { ja: "必殺技効率UP", en: "Finisher Efficiency UP" },
        { ja: "アーツダメージUP", en: "Arts Damage UP" },
      ],
      skill: [
        { ja: "圧制", en: "Domination" },
        { ja: "追襲", en: "Pursuit" },
        { ja: "昂揚", en: "Exaltation" },
        { ja: "巧技", en: "Skillful" },
        { ja: "付術", en: "Enchantment" },
        { ja: "治癒", en: "Healing" },
        { ja: "切骨", en: "Bonecut" },
        { ja: "効率", en: "Efficiency" },
      ],
    },
  },
  mine_area: {
    area: { ja: "鉱山エリア", en: "Mine Area" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "HPアップ", en: "HP UP" },
        { ja: "物理ダメージUP", en: "Physical Damage UP" },
        { ja: "灼熱ダメージUP", en: "Fire Damage UP" },
        { ja: "寒冷ダメージUP", en: "Cold Damage UP" },
        { ja: "自然ダメージUP", en: "Nature Damage UP" },
        { ja: "会心率UP", en: "Critical Rate UP" },
        { ja: "アーツ強度UP", en: "Arts Power UP" },
        { ja: "回復効率UP", en: "Healing Efficiency UP" },
      ],
      skill: [
        { ja: "強攻", en: "Assault" },
        { ja: "圧制", en: "Domination" },
        { ja: "巧技", en: "Skillful" },
        { ja: "残虐", en: "Brutality" },
        { ja: "付術", en: "Enchantment" },
        { ja: "噴発", en: "Eruption" },
        { ja: "夜幕", en: "Nightfall" },
        { ja: "効率", en: "Efficiency" },
      ],
    },
  },
  energy_highland: {
    area: { ja: "エネルギー高地", en: "Energy Highland" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "攻撃力UP", en: "Attack UP" },
        { ja: "HPアップ", en: "HP UP" },
        { ja: "物理ダメージUP", en: "Physical Damage UP" },
        { ja: "灼熱ダメージUP", en: "Fire Damage UP" },
        { ja: "自然ダメージUP", en: "Nature Damage UP" },
        { ja: "会心率UP", en: "Critical Rate UP" },
        { ja: "アーツ強度UP", en: "Arts Power UP" },
        { ja: "回復効率UP", en: "Healing Efficiency UP" },
      ],
      skill: [
        { ja: "追襲", en: "Pursuit" },
        { ja: "破砕", en: "Crush" },
        { ja: "昂揚", en: "Exaltation" },
        { ja: "残虐", en: "Brutality" },
        { ja: "付術", en: "Enchantment" },
        { ja: "治癒", en: "Healing" },
        { ja: "切骨", en: "Bonecut" },
        { ja: "流回", en: "Circulation" },
      ],
    },
  },
  wuling_city: {
    area: { ja: "武陵城", en: "Wuling City" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "攻撃力UP", en: "Attack UP" },
        { ja: "HPアップ", en: "HP UP" },
        { ja: "電磁ダメージUP", en: "Electric Damage UP" },
        { ja: "寒冷ダメージUP", en: "Cold Damage UP" },
        { ja: "必殺技効率UP", en: "Finisher Efficiency UP" },
        { ja: "アーツダメージUP", en: "Arts Damage UP" },
        { ja: "回復効率UP", en: "Healing Efficiency UP" },
      ],
      skill: [
        { ja: "強攻", en: "Assault" },
        { ja: "破砕", en: "Crush" },
        { ja: "残虐", en: "Brutality" },
        { ja: "治癒", en: "Healing" },
        { ja: "切骨", en: "Bonecut" },
        { ja: "噴発", en: "Eruption" },
        { ja: "夜幕", en: "Nightfall" },
        { ja: "流回", en: "Circulation" },
      ],
    },
  },
  qingbo_fort: {
    area: { ja: "清波砦", en: "Qingbo Fort" },
    effects: {
      base: [
        { ja: "敏捷UP", en: "Agility UP" },
        { ja: "筋力UP", en: "Strength UP" },
        { ja: "意志UP", en: "Will UP" },
        { ja: "知性UP", en: "Intelligence UP" },
        { ja: "メイン能力UP", en: "Main Ability UP" },
      ],
      additional: [
        { ja: "HPアップ", en: "HP UP" },
        { ja: "物理ダメージUP", en: "Physical Damage UP" },
        { ja: "電磁ダメージUP", en: "Electric Damage UP" },
        { ja: "寒冷ダメージUP", en: "Cold Damage UP" },
        { ja: "アーツ強度UP", en: "Arts Power UP" },
        { ja: "必殺技効率UP", en: "Finisher Efficiency UP" },
        { ja: "アーツダメージUP", en: "Arts Damage UP" },
        { ja: "回復効率UP", en: "Healing Efficiency UP" },
      ],
      skill: [
        { ja: "圧制", en: "Domination" },
        { ja: "破砕", en: "Crush" },
        { ja: "治癒", en: "Healing" },
        { ja: "切骨", en: "Bonecut" },
        { ja: "噴発", en: "Eruption" },
        { ja: "夜幕", en: "Nightfall" },
        { ja: "昂揚", en: "Exaltation" },
        { ja: "巧技", en: "Skillful" },
      ],
    },
  },
};
