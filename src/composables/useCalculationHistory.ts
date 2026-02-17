import { ref, watch } from "vue";

export interface HistoryItem {
  base: string;
  additional: string;
  skill: string;
  timestamp: number;
  isFavorite?: boolean;
}

const STORAGE_KEY = "kishitu-calculation-history";
const MAX_HISTORY_SIZE = 10;

// シングルトンとして履歴状態を保持
const history = ref<HistoryItem[]>([]);
let isInitialized = false;

// localStorageから履歴を読み込む
const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as HistoryItem[];
      history.value = parsed;
    }
  } catch (e) {
    console.error("Failed to load calculation history:", e);
    history.value = [];
  }
};

// localStorageに履歴を保存する
const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
  } catch (e) {
    console.error("Failed to save calculation history:", e);
  }
};

export function useCalculationHistory() {
  // 初回のみ読み込みと監視を設定
  if (!isInitialized) {
    loadHistory();

    // historyが変更されたら自動保存
    watch(
      history,
      () => {
        saveHistory();
      },
      { deep: true },
    );

    isInitialized = true;
  }

  // 計算履歴を追加する
  const addToHistory = (base: string, additional: string, skill: string) => {
    // 同じ組み合わせが既に存在するか確認
    const existingIndex = history.value.findIndex(
      (item) =>
        item.base === base &&
        item.additional === additional &&
        item.skill === skill,
    );

    // 既存のものがあれば、お気に入り状態を保持して削除
    let wasFavorite = false;
    if (existingIndex !== -1) {
      wasFavorite = history.value[existingIndex].isFavorite || false;
      history.value.splice(existingIndex, 1);
    }

    // 新しいアイテムを先頭に追加（お気に入り状態を保持）
    history.value.unshift({
      base,
      additional,
      skill,
      timestamp: Date.now(),
      isFavorite: wasFavorite,
    });

    // MAX_HISTORY_SIZE件を超えたら古いものを削除
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value = history.value.slice(0, MAX_HISTORY_SIZE);
    }

    saveHistory();
  };

  // 履歴アイテムを削除する
  const removeFromHistory = (index: number) => {
    history.value.splice(index, 1);
    saveHistory();
  };

  // すべての履歴をクリアする
  const clearHistory = () => {
    history.value = [];
    saveHistory();
  };

  // お気に入り状態をトグル
  const toggleFavorite = (index: number) => {
    if (history.value[index]) {
      history.value[index].isFavorite = !history.value[index].isFavorite;
      saveHistory();
    }
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
  };
}
