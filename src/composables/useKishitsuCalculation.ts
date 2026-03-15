import { ref, computed, onMounted, nextTick, watch } from "vue";
import { run, DROP_EFFECTS } from "../lib/kishitu-gensen";
import type { CalculationResult, AreaResult } from "../types";
import type {
  AdditionalEffect,
  AreaKey,
  BaseEffect,
  DropEffectsI18n,
  SkillEffect,
} from "../lib/constants/dropEffects";
import {
  decodeAdditionalEffectParam,
  decodeBaseEffectParam,
  decodeSkillEffectParam,
  encodeAdditionalEffectParam,
  encodeBaseEffectParam,
  encodeSkillEffectParam,
} from "../lib/i18n";
import { useCalculationHistory } from "./useCalculationHistory";
import { useI18n } from "./useI18n";

export function useKishitsuCalculation() {
  const { addToHistory } = useCalculationHistory();
  const { locale, t } = useI18n();
  const allAreas = Object.values(DROP_EFFECTS) as DropEffectsI18n[AreaKey][];

  // エリアごとの選択肢を取得
  const allBaseEffects = Array.from(
    new Set(
      allAreas.flatMap((area) => area.effects.base.map((effect) => effect.ja)),
    ),
  ).sort();

  const allAdditionalEffects = Array.from(
    new Set(
      allAreas.flatMap((area) =>
        area.effects.additional.map((effect) => effect.ja),
      ),
    ),
  ).sort();

  const allSkillEffects = Array.from(
    new Set(
      allAreas.flatMap((area) => area.effects.skill.map((effect) => effect.ja)),
    ),
  ).sort();

  // 選択された値
  const selectedBase = ref<BaseEffect>("知性UP");
  const selectedAdditional = ref<AdditionalEffect>("攻撃力UP");
  const selectedSkill = ref<SkillEffect>("夜幕");

  // 結果
  const result = ref<CalculationResult | null>(null);
  const error = ref<string>("");

  // URLからパラメータを読み込む
  const loadFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const base =
      decodeBaseEffectParam(params.get("b")) ??
      (params.get("base") as BaseEffect | null);
    const additional =
      decodeAdditionalEffectParam(params.get("a")) ??
      (params.get("additional") as AdditionalEffect | null);
    const skill =
      decodeSkillEffectParam(params.get("s")) ??
      (params.get("skill") as SkillEffect | null);

    if (base && allBaseEffects.includes(base as BaseEffect)) {
      selectedBase.value = base as BaseEffect;
    }
    if (
      additional &&
      allAdditionalEffects.includes(additional as AdditionalEffect)
    ) {
      selectedAdditional.value = additional as AdditionalEffect;
    }
    if (skill && allSkillEffects.includes(skill as SkillEffect)) {
      selectedSkill.value = skill as SkillEffect;
    }

    // パラメータがあれば自動計算
    if (base || additional || skill) {
      calculate();
    }
  };

  // URLを更新
  const updateUrl = () => {
    const params = new URLSearchParams();
    const baseParam = encodeBaseEffectParam(selectedBase.value);
    const additionalParam = encodeAdditionalEffectParam(
      selectedAdditional.value,
    );
    const skillParam = encodeSkillEffectParam(selectedSkill.value);

    if (baseParam) params.set("b", baseParam);
    if (additionalParam) params.set("a", additionalParam);
    if (skillParam) params.set("s", skillParam);
    params.set("lang", locale.value);

    // ハッシュを保持する
    const hash = window.location.hash;
    const newUrl = `${window.location.pathname}?${params.toString()}${hash}`;
    window.history.pushState({}, "", newUrl);
  };

  // 計算実行
  const calculate = () => {
    error.value = "";
    result.value = null;

    const input = [
      `基礎：${selectedBase.value}`,
      `付加：${selectedAdditional.value}`,
      `スキル：${selectedSkill.value}`,
    ];

    try {
      const output = run(input, locale.value);
      if (output.error) {
        const errorCode = output.errorCode;
        if (errorCode === "invalid_input_count") {
          error.value = t("errorInvalidInputCount");
        } else if (errorCode === "invalid_item") {
          error.value = t("errorInvalidItem", { item: output.errorItem ?? "" });
        } else if (errorCode === "invalid_group") {
          error.value = t("errorInvalidGroup", {
            item: output.errorItem ?? "",
          });
        } else if (errorCode === "invalid_group_count") {
          error.value = t("errorInvalidGroupCount");
        } else {
          error.value = output.error;
        }
      } else {
        result.value = output as CalculationResult;
        updateUrl();
        // 計算履歴に追加
        addToHistory(
          selectedBase.value,
          selectedAdditional.value,
          selectedSkill.value,
        );
      }
    } catch (e) {
      error.value = t("errorUnexpected", { error: String(e) });
    }
  };

  // 初回ロード時にURLから読み込み
  onMounted(() => {
    loadFromUrl();
  });

  // 結果が描画された後にハッシュに基づいてスクロール
  watch(result, (newResult) => {
    if (newResult && window.location.hash) {
      // DOMの更新を待ってからスクロール
      nextTick(() => {
        setTimeout(() => {
          const hash = window.location.hash;
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100); // 少し待機してレンダリングを確実に完了させる
      });
    }
  });

  // 結果のフォーマット（エリアごと）
  const formattedResults = computed<AreaResult[]>(() => {
    if (!result.value?.results) return [];
    return result.value.results;
  });

  return {
    allBaseEffects,
    allAdditionalEffects,
    allSkillEffects,
    selectedBase,
    selectedAdditional,
    selectedSkill,
    result,
    error,
    calculate,
    formattedResults,
  };
}
