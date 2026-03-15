import { DROP_EFFECTS } from "../constants/dropEffects";
import type {
  AdditionalEffect,
  AreaJa,
  BaseEffect,
  SkillEffect,
} from "../constants/dropEffects";

export type Locale = "ja" | "en";

export const LOCALE_STORAGE_KEY = "kishitu-locale";

export const MESSAGES = {
  ja: {
    appTitle: "🎮 基質厳選ツール",
    appSubtitle: "アークナイツ：エンドフィールド - 基質（武器）厳選補助",
    appSharePrompt: "使いやすかったらシェアしてくださると励みになります 😊",
    appShareX: "Xでシェア",
    appShareBluesky: "Blueskyでシェア",
    appShareHashtag: "エンドフィールド",
    appCopyLink: "リンクをコピー",
    appCopyDone: "コピー完了！",
    appGithubRepo: "GitHub リポジトリ",
    appBugReport: "バグ報告や機能要望も歓迎します 🐛",
    appLanguage: "表示言語",
    appLanguageJa: "日本語",
    appLanguageEn: "English",

    descriptionLine1:
      "このツールは、欲しい基質を選択すると、一緒に狙える基質を超域活性点ごとに全パターン表示します。",
    descriptionLine2: "武器及び超域活性点は2026/02/17時点のデータです。",

    inputTitle: "欲しい基質の効果を選択",
    inputBaseLabel: "基礎効果：",
    inputAdditionalLabel: "付加効果：",
    inputSkillLabel: "スキル効果：",
    inputCalculate: "厳選パターンを計算",

    resultsSelectedTitle: "選択された基質効果",
    resultsBaseLabel: "基礎効果：",
    resultsAdditionalLabel: "付加効果：",
    resultsSkillLabel: "スキル効果：",

    areaNoResult: "なし（このエリアでは目的の基質は入手できません）",

    patternTitle: "パターン {number}",
    patternWeaponsNone: "武器なし",
    patternRequiredBase: "基礎効果（必須選択）:",
    patternRequiredAdditional: "付加効果（必須選択）:",
    patternRequiredSkill: "スキル効果（必須選択）:",
    patternRandomSkill: "スキル効果（ランダム）：",
    patternRandomAdditional: "付加効果（ランダム）：",
    patternDesiredEffect: "希望した効果:",
    patternCopyLinkTitle: "このパターンへのリンクをコピー",
    patternCountFormat: "☆{rarity}: {count}個",

    historyTitle: "計算履歴",
    historyFilterAll: "すべて表示",
    historyFilterFavorites: "お気に入りのみ",
    historyClearAll: "すべて削除",
    historyEmpty: "計算履歴はまだありません",
    historyEmptyFavorites: "お気に入りの履歴はまだありません",
    historyFavoriteTitle: "お気に入り",
    historyDeleteTitle: "削除",
    historyJustNow: "たった今",
    historyMinutesAgo: "{minutes}分前",
    historyHoursAgo: "{hours}時間前",

    changelogTitle: "📝 最近の更新",
    changelogLoading: "読み込み中...",
    changelogLoadFailed: "更新履歴の読み込みに失敗しました",
    changelogViewAll: "すべての更新履歴を見る →",
    changelogEmpty: "更新履歴がありません",

    rarityCollected: "入手済み",
    rarityUncollected: "未入手",

    modeAdditionalLocked: "付加固定",
    modeSkillLocked: "スキル固定",

    outputWantedHeader: "欲しいドロップ（確定入力）:",
    outputBaseLabel: "基礎",
    outputAdditionalLabel: "付加",
    outputSkillLabel: "スキル",
    outputNone: "なし",
    outputBaseChoicesTitle: "基礎（3種選択）候補:",
    outputLockedAdditional: "付加（固定）: {effect}",
    outputLockedSkill: "スキル（固定）: {effect}",
    outputRandomSkill:
      "スキル（ランダム）: エリアプールから（欲しい: {effect}）",
    outputRandomAdditional:
      "付加（ランダム）: エリアプールから（欲しい: {effect}）",

    errorUnexpected: "エラーが発生しました: {error}",
    errorInvalidInputCount:
      "入力が不正です（基礎/付加/スキルを各1つずつ、合計3つ入力してください）",
    errorInvalidItem: "入力が不正です: {item}",
    errorInvalidGroup: "入力が不正です（基礎/付加/スキルのみ）: {item}",
    errorInvalidGroupCount:
      "入力が不正です（基礎/付加/スキルが各1つずつ必要です）",
  },
  en: {
    appTitle: "🎮 Substrate Farming Tool",
    appSubtitle: "Arknights: Endfield - Substrate (Weapon) Farming Assistant",
    appSharePrompt: "If this helped, sharing it would really support me 😊",
    appShareX: "Share on X",
    appShareBluesky: "Share on Bluesky",
    appShareHashtag: "Endfield",
    appCopyLink: "Copy link",
    appCopyDone: "Copied!",
    appGithubRepo: "GitHub Repository",
    appBugReport: "Bug reports and feature requests are welcome 🐛",
    appLanguage: "Language",
    appLanguageJa: "Japanese",
    appLanguageEn: "English",

    descriptionLine1:
      "Select the substrate effects you want, and this tool shows all possible co-farm patterns by overclock zone.",
    descriptionLine2: "Weapon and overclock zone data are as of 2026-02-17.",

    inputTitle: "Select desired substrate effects",
    inputBaseLabel: "Base Effect:",
    inputAdditionalLabel: "Additional Effect:",
    inputSkillLabel: "Skill Effect:",
    inputCalculate: "Calculate farming patterns",

    resultsSelectedTitle: "Selected substrate effects",
    resultsBaseLabel: "Base Effect:",
    resultsAdditionalLabel: "Additional Effect:",
    resultsSkillLabel: "Skill Effect:",

    areaNoResult:
      "None (your target substrate cannot be obtained in this area)",

    patternTitle: "Pattern {number}",
    patternWeaponsNone: "No weapons",
    patternRequiredBase: "Base effect (required):",
    patternRequiredAdditional: "Additional effect (required):",
    patternRequiredSkill: "Skill effect (required):",
    patternRandomSkill: "Skill effect (random):",
    patternRandomAdditional: "Additional effect (random):",
    patternDesiredEffect: "Desired effect:",
    patternCopyLinkTitle: "Copy link to this pattern",
    patternCountFormat: "★{rarity}: {count}",

    historyTitle: "Calculation History",
    historyFilterAll: "Show all",
    historyFilterFavorites: "Favorites only",
    historyClearAll: "Clear all",
    historyEmpty: "No calculation history yet",
    historyEmptyFavorites: "No favorite history yet",
    historyFavoriteTitle: "Favorite",
    historyDeleteTitle: "Delete",
    historyJustNow: "just now",
    historyMinutesAgo: "{minutes} min ago",
    historyHoursAgo: "{hours} hr ago",

    changelogTitle: "📝 Recent Updates",
    changelogLoading: "Loading...",
    changelogLoadFailed: "Failed to load changelog",
    changelogViewAll: "View all commits →",
    changelogEmpty: "No updates yet",

    rarityCollected: "Collected",
    rarityUncollected: "Not Collected",

    modeAdditionalLocked: "Additional Locked",
    modeSkillLocked: "Skill Locked",

    outputWantedHeader: "Desired drop (fixed input):",
    outputBaseLabel: "Base",
    outputAdditionalLabel: "Additional",
    outputSkillLabel: "Skill",
    outputNone: "None",
    outputBaseChoicesTitle: "Base choices (pick 3):",
    outputLockedAdditional: "Additional (locked): {effect}",
    outputLockedSkill: "Skill (locked): {effect}",
    outputRandomSkill: "Skill (random): from area pool (wanted: {effect})",
    outputRandomAdditional:
      "Additional (random): from area pool (wanted: {effect})",

    errorUnexpected: "An error occurred: {error}",
    errorInvalidInputCount:
      "Invalid input (enter exactly one each for base/additional/skill)",
    errorInvalidItem: "Invalid input: {item}",
    errorInvalidGroup:
      "Invalid input (only base/additional/skill are allowed): {item}",
    errorInvalidGroupCount:
      "Invalid input (base/additional/skill must each appear once)",
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)["ja"];

const interpolate = (
  template: string,
  params?: Record<string, string | number>,
): string => {
  if (!params) return template;
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value));
  }, template);
};

export const translate = (
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string => {
  return interpolate(MESSAGES[locale][key], params);
};

const effectI18nMap = new Map<string, { ja: string; en: string }>();
const areaI18nMap = new Map<string, { ja: string; en: string }>();
const weaponI18nMap = new Map<string, { ja: string; en: string }>([
  ["遺忘", { ja: "遺忘", en: "Oblivion" }],
  ["騎士精神", { ja: "騎士精神", en: "Chivalric Virtues" }],
  ["作品：蝕跡", { ja: "作品：蝕跡", en: "Work: Corroded Trace" }],
  ["使命必達", { ja: "使命必達", en: "Mission Accomplished" }],
  ["蒼星の囁き", { ja: "蒼星の囁き", en: "Whisper of Azure Star" }],
  ["破壊ユニット", { ja: "破壊ユニット", en: "Detonation Unit" }],
  ["ナビゲーター", { ja: "ナビゲーター", en: "Navigator" }],
  ["芸術の独裁者", { ja: "芸術の独裁者", en: "Dictator of Art" }],
  ["同類共食", { ja: "同類共食", en: "Clannibal" }],
  ["楔", { ja: "楔", en: "Wedge" }],
  ["クラヴェンガー", { ja: "クラヴェンガー", en: "Clavenger" }],
  ["鑑", { ja: "鑑", en: "Mirror" }],
  ["昔日の逸品", { ja: "昔日の逸品", en: "Relic of Yesteryear" }],
  ["大雷斑", { ja: "大雷斑", en: "Thunderberge" }],
  ["破砕君主", { ja: "破砕君主", en: "Shatterlord" }],
  ["J.E.T.", { ja: "J.E.T.", en: "JET" }],
  ["負山", { ja: "負山", en: "Mountain Bearer" }],
  ["勇猛", { ja: "勇猛", en: "Valiant" }],
  ["ダークトーチ", { ja: "ダークトーチ", en: "Umbral Torch" }],
  [
    "テルミット・カッター",
    { ja: "テルミット・カッター", en: "Thermite Cutter" },
  ],
  ["フーヤオ", { ja: "フーヤオ", en: "Fuyao" }],
  ["フレイムフォージ", { ja: "フレイムフォージ", en: "Flameforge" }],
  ["輝かしき名声", { ja: "輝かしき名声", en: "Resplendent Fame" }],
  ["大願", { ja: "大願", en: "Great Vow" }],
  ["白夜新星", { ja: "白夜新星", en: "White-Night Nova" }],
  ["不知帰", { ja: "不知帰", en: "No Return" }],
  ["栄光の記憶", { ja: "栄光の記憶", en: "Memory of Glory" }],
  ["望郷", { ja: "望郷", en: "Nostalgia" }],
  ["落草", { ja: "落草", en: "Outlaw" }],
  ["O.B.J.術識", { ja: "O.B.J.術識", en: "O.B.J. Arcanum" }],
  ["荒野迷走", { ja: "荒野迷走", en: "Wasteland Drift" }],
  ["術無", { ja: "術無", en: "Artless" }],
  ["弔いの詩", { ja: "弔いの詩", en: "Elegy" }],
  ["布教の自由", { ja: "布教の自由", en: "Freedom to Preach" }],
  ["O.B.J.迅速", { ja: "O.B.J.迅速", en: "O.B.J. Swift" }],
  ["合理的決別", { ja: "合理的決別", en: "Rational Farewell" }],
  ["作品：衆生", { ja: "作品：衆生", en: "Work: All Beings" }],
  ["O.B.J.重責", { ja: "O.B.J.重責", en: "O.B.J. Burden" }],
  ["最期の声", { ja: "最期の声", en: "Last Voice" }],
  ["千古恒常", { ja: "千古恒常", en: "Eternal Through Ages" }],
  ["探龍", { ja: "探龍", en: "Dragonseeker" }],
  ["O.B.J.鋭矛", { ja: "O.B.J.鋭矛", en: "O.B.J. Keen Spear" }],
  ["求心の槍", { ja: "求心の槍", en: "Spear of Cohesion" }],
  ["正義嵌合", { ja: "正義嵌合", en: "Justice Interlock" }],
  ["O.B.J.軽刃", { ja: "O.B.J.軽刃", en: "O.B.J. Light Blade" }],
  ["フィンチェイサー3.0", { ja: "フィンチェイサー3.0", en: "Fin Chaser 3.0" }],
  ["仰止", { ja: "仰止", en: "Reverence" }],
  ["堅城鋳造者", { ja: "堅城鋳造者", en: "Bastion Forger" }],
  ["鋼鉄余音", { ja: "鋼鉄余音", en: "Steel Resonance" }],
  ["十二問", { ja: "十二問", en: "Twelve Questions" }],
  [
    "オート・ハイパーノヴァ",
    { ja: "オート・ハイパーノヴァ", en: "Hypernova Auto" },
  ],
  ["蛍光雷羽", { ja: "蛍光雷羽", en: "Luminous Thunderfeather" }],
  ["ロアーガード", { ja: "ロアーガード", en: "Howling Guard" }],
  ["長路", { ja: "長路", en: "Long Road" }],
  ["工業零点一", { ja: "工業零点一", en: "Industry 0.1" }],
  ["鍛冶師", { ja: "鍛冶師", en: "Smith" }],
  [
    "アンゲロス・スレイヤー",
    { ja: "アンゲロス・スレイヤー", en: "Aggeloslayer" },
  ],
  ["開拓者の道標", { ja: "開拓者の道標", en: "Pathfinder's Beacon" }],
  ["緊急設計", { ja: "緊急設計", en: "Emergency Design" }],
  ["潮流", { ja: "潮流", en: "Tideflow" }],
]);

for (const area of Object.values(DROP_EFFECTS)) {
  areaI18nMap.set(area.area.ja, area.area);

  for (const effect of area.effects.base) {
    effectI18nMap.set(effect.ja, effect);
  }
  for (const effect of area.effects.additional) {
    effectI18nMap.set(effect.ja, effect);
  }
  for (const effect of area.effects.skill) {
    effectI18nMap.set(effect.ja, effect);
  }
}

export const localizeEffectName = (
  effectJa: string,
  locale: Locale,
): string => {
  const value = effectI18nMap.get(effectJa);
  return value ? value[locale] : effectJa;
};

export const localizeAreaName = (areaJa: string, locale: Locale): string => {
  const value = areaI18nMap.get(areaJa);
  return value ? value[locale] : areaJa;
};

export const localizeWeaponName = (
  weaponJa: string,
  locale: Locale,
): string => {
  const value = weaponI18nMap.get(weaponJa);
  return value ? value[locale] : weaponJa;
};

export const BASE_EFFECT_PARAM_ORDER: readonly BaseEffect[] = [
  "敏捷UP",
  "筋力UP",
  "意志UP",
  "知性UP",
  "メイン能力UP",
];

export const ADDITIONAL_EFFECT_PARAM_ORDER: readonly AdditionalEffect[] = [
  "攻撃力UP",
  "HPアップ",
  "物理ダメージUP",
  "灼熱ダメージUP",
  "電磁ダメージUP",
  "寒冷ダメージUP",
  "自然ダメージUP",
  "会心率UP",
  "アーツ強度UP",
  "必殺技効率UP",
  "アーツダメージUP",
  "回復効率UP",
];

export const SKILL_EFFECT_PARAM_ORDER: readonly SkillEffect[] = [
  "強攻",
  "圧制",
  "追襲",
  "破砕",
  "巧技",
  "噴発",
  "流回",
  "効率",
  "昂揚",
  "付術",
  "治癒",
  "切骨",
  "残虐",
  "夜幕",
];

const toIndexedMap = <T extends string>(values: readonly T[]) => {
  const encodeMap = new Map<T, string>();
  const decodeMap = new Map<string, T>();

  values.forEach((value, index) => {
    const key = String(index + 1);
    encodeMap.set(value, key);
    decodeMap.set(key, value);
  });

  return { encodeMap, decodeMap };
};

const baseCodec = toIndexedMap(BASE_EFFECT_PARAM_ORDER);
const additionalCodec = toIndexedMap(ADDITIONAL_EFFECT_PARAM_ORDER);
const skillCodec = toIndexedMap(SKILL_EFFECT_PARAM_ORDER);

export const encodeBaseEffectParam = (value: BaseEffect): string | null => {
  return baseCodec.encodeMap.get(value) ?? null;
};

export const decodeBaseEffectParam = (
  param: string | null,
): BaseEffect | null => {
  if (!param) return null;
  return baseCodec.decodeMap.get(param) ?? null;
};

export const encodeAdditionalEffectParam = (
  value: AdditionalEffect,
): string | null => {
  return additionalCodec.encodeMap.get(value) ?? null;
};

export const decodeAdditionalEffectParam = (
  param: string | null,
): AdditionalEffect | null => {
  if (!param) return null;
  return additionalCodec.decodeMap.get(param) ?? null;
};

export const encodeSkillEffectParam = (value: SkillEffect): string | null => {
  return skillCodec.encodeMap.get(value) ?? null;
};

export const decodeSkillEffectParam = (
  param: string | null,
): SkillEffect | null => {
  if (!param) return null;
  return skillCodec.decodeMap.get(param) ?? null;
};

export const isAreaJa = (value: string): value is AreaJa => {
  return areaI18nMap.has(value);
};
