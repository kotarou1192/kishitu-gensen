import { DROP_EFFECTS } from "./constants/dropEffects";
import { WEAPONS } from "./constants/weapons";
import { uniq, combinations, normalizeEffect } from "./utils";

// ==============================
// input[0] = ['基礎：知性', '付加：攻撃力', 'スキル：夜幕'] 固定
// ==============================
const parseWantedTriple = (input: any, dropEffects: any) => {
  const rows = input;
  if (!Array.isArray(rows) || rows.length !== 3) {
    return {
      error:
        "入力が不正です（基礎/付加/スキルを各1つずつ、合計3つ入力してください）",
    };
  }

  const out = { base: null, additional: null, skill: null } as {
    base: string | null;
    additional: string | null;
    skill: string | null;
  };
  const seen = { 基礎: 0, 付加: 0, スキル: 0 };

  for (const rawItem of rows) {
    const item = String(rawItem).trim();
    const [group, raw]: ["基礎" | "付加" | "スキル", string] = item.split(
      "：",
    ) as ["基礎" | "付加" | "スキル", string];
    if (!group || !raw) return { error: `入力が不正です: ${item}` };
    if (!["基礎", "付加", "スキル"].includes(group)) {
      return { error: `入力が不正です（基礎/付加/スキルのみ）: ${item}` };
    }

    seen[group] += 1;
    const val = normalizeEffect(group, raw, dropEffects);

    if (group === "基礎") out.base = val;
    if (group === "付加") out.additional = val;
    if (group === "スキル") out.skill = val;
  }

  if (seen["基礎"] !== 1 || seen["付加"] !== 1 || seen["スキル"] !== 1) {
    return { error: "入力が不正です（基礎/付加/スキルが各1つずつ必要です）" };
  }

  return { wanted: out };
};

// ==============================
// エリアで「欲しい武器が成立する固定枠パターン」を列挙
// 固定枠:
// - base: 3種類（その中からランダムで武器baseが決まる）
// - additional or skill: どちらか1種類を固定
// ==============================
const enumerateValidLockPatternsForArea = (areaTable: any, wanted: any) => {
  const basePool = uniq(areaTable.base || []);
  const addPool = uniq(areaTable.additional || []);
  const skillPool = uniq(areaTable.skill || []);

  // 欲しいbaseがそもそも出ないなら終了
  if (!basePool.includes(wanted.base)) return [];

  // base3選択：wanted.base + 他2つ
  const otherBases = basePool.filter((x) => x !== wanted.base);
  const baseTriples = combinations(otherBases, 2).map((pair) => [
    wanted.base,
    ...pair,
  ]);

  const patterns = [];

  // 付加固定モード：additional固定= wanted.additional、skillはランダムなので wanted.skill が pool に必要
  if (addPool.includes(wanted.additional) && skillPool.includes(wanted.skill)) {
    for (const base3 of baseTriples) {
      patterns.push({
        mode: "付加固定",
        baseChoices: base3,
        lockedAdditional: wanted.additional,
        lockedSkill: null,
      });
    }
  }

  // スキル固定モード：skill固定= wanted.skill、additionalはランダムなので wanted.additional が pool に必要
  if (skillPool.includes(wanted.skill) && addPool.includes(wanted.additional)) {
    for (const base3 of baseTriples) {
      patterns.push({
        mode: "スキル固定",
        baseChoices: base3,
        lockedAdditional: null,
        lockedSkill: wanted.skill,
      });
    }
  }

  return patterns;
};

// ==============================
// その固定枠パターンで「落ちうる武器」を抽出
// 条件:
// - weapon.base が baseChoices に含まれる
// - 付加固定なら weapon.additional == lockedAdditional
// - スキル固定なら weapon.skill == lockedSkill
// - ランダム側の値がエリアpoolに含まれる（念のため）
// ==============================
const weaponsPossibleUnderPattern = (areaTable: any, pattern: any) => {
  const addPool = new Set(areaTable.additional || []);
  const skillPool = new Set(areaTable.skill || []);
  const baseSet = new Set(pattern.baseChoices);

  return WEAPONS.filter((w) => {
    if (!baseSet.has(w.base)) return false;

    if (pattern.mode === "付加固定") {
      if (w.additional !== pattern.lockedAdditional) return false;
      // skillはランダム側なので、そのエリアで出る必要
      if (!skillPool.has(w.skill)) return false;
      return true;
    }

    if (pattern.mode === "スキル固定") {
      if (w.skill !== pattern.lockedSkill) return false;
      // additionalはランダム側なので、そのエリアで出る必要
      if (!addPool.has(w.additional)) return false;
      return true;
    }

    return false;
  });
};

// ==============================
// 重複統合：
// - 同一エリア・同一モードで、武器集合が同じパターンはまとめる
// - まとめたものは baseChoices を候補として列挙（同一武器集合に対し複数base3があり得るため）
// ==============================
const consolidatePatterns = (areaTable: any, patterns: any) => {
  // key = mode + weaponNames signature
  const map = new Map();

  for (const p of patterns) {
    const ws = weaponsPossibleUnderPattern(areaTable, p);
    if (ws.length === 0) continue;

    const names = uniq(ws.map((x) => x.name)).sort();
    const signature = names.join("||");
    const key = `${p.mode}::${signature}`;

    if (!map.has(key)) {
      map.set(key, {
        mode: p.mode,
        lockedAdditional: p.lockedAdditional,
        lockedSkill: p.lockedSkill,
        baseChoicesList: [],
        weapons: ws,
        patternCount: 0,
      });
    }

    const g = map.get(key);
    g.baseChoicesList.push([...p.baseChoices].sort());
    g.patternCount += 1;
  }

  // 整形：patternCount（=成立パターン数）が多いものを上に
  const groups = Array.from(map.values()).sort(
    (a, b) => b.patternCount - a.patternCount,
  );

  // baseChoicesList の重複を潰す
  for (const g of groups) {
    const seen = new Set();
    g.baseChoicesList = g.baseChoicesList.filter((arr: string[]) => {
      const k = arr.join("|");
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    // 全パターンの共通部分を計算
    if (g.baseChoicesList.length > 0) {
      // 最初のパターンから開始
      let commonSet = new Set(g.baseChoicesList[0]);

      // 残りのパターンとの積集合を取る
      for (let i = 1; i < g.baseChoicesList.length; i++) {
        const currentSet = new Set(g.baseChoicesList[i]);
        commonSet = new Set([...commonSet].filter((x) => currentSet.has(x)));
      }

      g.requiredBaseChoices = Array.from(commonSet).sort();

      // 各パターンから共通部分を除いた可変部分を計算
      g.variableBaseChoicesList = g.baseChoicesList.map((choices: string[]) =>
        choices.filter((c) => !commonSet.has(c)).sort(),
      );
    } else {
      g.requiredBaseChoices = [];
      g.variableBaseChoicesList = [];
    }

    // レア別に整列
    g.byRarity = { 6: [], 5: [], 4: [], other: [] };
    for (const w of g.weapons) {
      const line = `${w.name}（${w.base}, ${w.additional}, ${w.skill}）`;
      if (w.rarity === 6) g.byRarity[6].push(line);
      else if (w.rarity === 5) g.byRarity[5].push(line);
      else if (w.rarity === 4) g.byRarity[4].push(line);
      else g.byRarity.other.push(line);
    }
  }

  return groups;
};

// ==============================
// 表示用
// ==============================
const formatArea = (areaName: string, wanted: any, groups: any) => {
  const lines = [];
  lines.push(`■${areaName}`);

  if (!groups || groups.length === 0) {
    lines.push("なし");
    return lines.join("\n");
  }

  for (const g of groups) {
    lines.push(`【${g.mode}】`);

    // baseの選択肢（3つ固定を候補として複数列挙）
    lines.push(`基礎（3種選択）候補:`);
    for (const b3 of g.baseChoicesList) {
      lines.push(`  - ${b3.join(", ")}`);
    }

    if (g.mode === "付加固定") {
      lines.push(`付加（固定）: ${g.lockedAdditional}`);
      lines.push(
        `スキル（ランダム）: エリアプールから（欲しい: ${wanted.skill}）`,
      );
    } else {
      lines.push(`スキル（固定）: ${g.lockedSkill}`);
      lines.push(
        `付加（ランダム）: エリアプールから（欲しい: ${wanted.additional}）`,
      );
    }

    const addSection = (title: string, arr: string[] | undefined) => {
      if (!arr || arr.length === 0) return;
      lines.push(`・${title}`);
      for (const x of arr) lines.push(`  ・${x}`);
    };

    addSection("☆6", g.byRarity[6]);
    addSection("☆5", g.byRarity[5]);
    addSection("☆4", g.byRarity[4]);
    addSection("☆?", g.byRarity.other);

    lines.push("");
  }

  return lines.join("\n");
};

// ==============================
// run（エントリポイント）
// ==============================
const run = (input: string[]) => {
  const parsed = parseWantedTriple(input, DROP_EFFECTS);
  if (parsed.error) return { error: parsed.error };

  const wanted = parsed.wanted;

  const results = [];
  const textLines = [];
  textLines.push(`欲しいドロップ（確定入力）:`);
  textLines.push(`  基礎: ${wanted?.base}`);
  textLines.push(`  付加: ${wanted?.additional}`);
  textLines.push(`  スキル: ${wanted?.skill}`);
  textLines.push("");

  for (const areaName of Object.keys(
    DROP_EFFECTS,
  ) as (keyof typeof DROP_EFFECTS)[]) {
    const table = DROP_EFFECTS[areaName];
    const patterns = enumerateValidLockPatternsForArea(table, wanted);
    const groups = consolidatePatterns(table, patterns);

    results.push({ areaName, groups });
    textLines.push(formatArea(areaName, wanted, groups));
  }

  return {
    wanted,
    text: textLines.join("\n"),
    results, // UI側で好きに整形したければこっちを見る
  };
};

export { run, DROP_EFFECTS, WEAPONS };
