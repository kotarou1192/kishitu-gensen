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

export const normalizeEffect = (
  group: string,
  raw: string,
  dropEffects: any,
) => {
  const key = String(raw).trim();

  // どこかで完全一致するならそれを優先（例外吸収）
  for (const area of Object.keys(dropEffects)) {
    const t = dropEffects[area];
    if (t.base?.includes(key)) return key;
    if (t.additional?.includes(key)) return key;
    if (t.skill?.includes(key)) return key;
  }

  if (group === "基礎") return key.endsWith("UP") ? key : `${key}UP`;
  if (group === "付加") {
    if (key.endsWith("UP") || key.endsWith("アップ")) return key;
    return `${key}UP`;
  }
  return key; // スキルはそのまま
};
