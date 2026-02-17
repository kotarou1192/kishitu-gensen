import { ref, watch } from "vue";

const STORAGE_KEY = "kishitu-weapon-collection";

// 所持している武器名のSet
const collectedWeapons = ref<Set<string>>(new Set());

// ローカルストレージから読み込み
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const weapons = JSON.parse(stored) as string[];
      collectedWeapons.value = new Set(weapons);
    }
  } catch (e) {
    console.error("Failed to load weapon collection:", e);
  }
};

// ローカルストレージに保存
const saveToStorage = () => {
  try {
    const weapons = Array.from(collectedWeapons.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weapons));
  } catch (e) {
    console.error("Failed to save weapon collection:", e);
  }
};

export function useWeaponCollection() {
  // 初回読み込み
  if (collectedWeapons.value.size === 0) {
    loadFromStorage();
  }

  // 変更を監視して自動保存
  watch(
    collectedWeapons,
    () => {
      saveToStorage();
    },
    { deep: true },
  );

  // 武器が所持済みかチェック
  const isCollected = (weaponName: string): boolean => {
    return collectedWeapons.value.has(weaponName);
  };

  // 武器を所持済みとしてマーク
  const markAsCollected = (weaponName: string) => {
    collectedWeapons.value.add(weaponName);
    collectedWeapons.value = new Set(collectedWeapons.value); // reactivityのためコピー
  };

  // 武器を未所持としてマーク
  const markAsUncollected = (weaponName: string) => {
    collectedWeapons.value.delete(weaponName);
    collectedWeapons.value = new Set(collectedWeapons.value); // reactivityのためコピー
  };

  // 武器の所持状態をトグル
  const toggleCollected = (weaponName: string) => {
    if (isCollected(weaponName)) {
      markAsUncollected(weaponName);
    } else {
      markAsCollected(weaponName);
    }
  };

  // 所持済み武器数を取得
  const getCollectedCount = (): number => {
    return collectedWeapons.value.size;
  };

  // 全クリア
  const clearAll = () => {
    collectedWeapons.value.clear();
    collectedWeapons.value = new Set();
  };

  return {
    isCollected,
    markAsCollected,
    markAsUncollected,
    toggleCollected,
    getCollectedCount,
    clearAll,
  };
}
