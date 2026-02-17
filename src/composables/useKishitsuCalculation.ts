import { ref, computed, onMounted, nextTick, watch } from "vue";
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

  // URLからパラメータを読み込む
  const loadFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const base = params.get("base");
    const additional = params.get("additional");
    const skill = params.get("skill");

    if (base && allBaseEffects.includes(base)) {
      selectedBase.value = base;
    }
    if (additional && allAdditionalEffects.includes(additional)) {
      selectedAdditional.value = additional;
    }
    if (skill && allSkillEffects.includes(skill)) {
      selectedSkill.value = skill;
    }

    // パラメータがあれば自動計算
    if (base || additional || skill) {
      calculate();
    }
  };

  // URLを更新
  const updateUrl = () => {
    const params = new URLSearchParams();
    params.set("base", selectedBase.value);
    params.set("additional", selectedAdditional.value);
    params.set("skill", selectedSkill.value);

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
      const output = run(input);
      if (output.error) {
        error.value = output.error;
      } else {
        result.value = output as CalculationResult;
        updateUrl();
      }
    } catch (e) {
      error.value = `エラーが発生しました: ${e}`;
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
