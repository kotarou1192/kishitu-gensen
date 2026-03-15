import type { AreaKey, DropEffectsI18n } from "./constants/dropEffects";

export const uniq = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

export const combinations = <T>(arr: T[], k: number): T[][] => {
  const res: T[][] = [];
  const dfs = (start: number, path: T[]) => {
    if (path.length === k) {
      res.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      dfs(i + 1, path);
      path.pop();
    }
  };
  dfs(0, []);
  return res;
};

export const normalizeEffect = (group: string, raw: string, dropEffects: DropEffectsI18n) => {
  const key = String(raw).trim();

  // どこかで完全一致するならそれを優先（例外吸収）
  for (const areaKey of Object.keys(dropEffects) as AreaKey[]) {
    const effects = dropEffects[areaKey].effects;
    if (effects.base.some((effect) => effect.ja === key)) return key;
    if (effects.additional.some((effect) => effect.ja === key)) return key;
    if (effects.skill.some((effect) => effect.ja === key)) return key;
  }

  if (group === "基礎") return key.endsWith("UP") ? key : `${key}UP`;
  if (group === "付加") {
    if (key.endsWith("UP") || key.endsWith("アップ")) return key;
    return `${key}UP`;
  }
  return key; // スキルはそのまま
};
