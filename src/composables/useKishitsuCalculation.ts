import { ref, computed } from "vue";
import { run, DROP_EFFECTS } from "../lib/kishitu-gensen";
import type { CalculationResult, AreaResult } from "../types";

export function useKishitsuCalculation() {
  // エリアごとの選択肢を取得
  const allBaseEffects = Array.from(
    new Set(Object.values(DROP_EFFECTS).flatMap((area) => area.base)),
  ).sort();

  const allAdditionalEffects = Array.from(
    new Set(Object.values(DROP_EFFECTS).flatMap((area) => area.additional)),
  ).sort();

  const allSkillEffects = Array.from(
    new Set(Object.values(DROP_EFFECTS).flatMap((area) => area.skill)),
  ).sort();

  // 選択された値
  const selectedBase = ref("知性UP");
  const selectedAdditional = ref("攻撃力UP");
  const selectedSkill = ref("夜幕");

  // 結果
  const result = ref<CalculationResult | null>(null);
  const error = ref<string>("");

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
      const output = run(input);
      if (output.error) {
        error.value = output.error;
      } else {
        result.value = output as CalculationResult;
      }
    } catch (e) {
      error.value = `エラーが発生しました: ${e}`;
    }
  };

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
