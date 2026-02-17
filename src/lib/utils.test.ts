import { describe, it, expect } from "vitest";
import { uniq, combinations, normalizeEffect } from "./utils";
import { DROP_EFFECTS } from "./constants/dropEffects";

describe("uniq", () => {
  it("重複を削除して一意な配列を返す", () => {
    expect(uniq([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(uniq(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("既に一意な配列はそのまま返す", () => {
    expect(uniq([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("空配列を処理できる", () => {
    expect(uniq([])).toEqual([]);
  });

  it("単一要素の配列を処理できる", () => {
    expect(uniq([1])).toEqual([1]);
  });
});

describe("combinations", () => {
  it("配列から2つの組み合わせを生成する", () => {
    const result = combinations([1, 2, 3], 2);
    expect(result).toEqual([
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
  });

  it("配列から3つの組み合わせを生成する", () => {
    const result = combinations([1, 2, 3, 4], 3);
    expect(result).toEqual([
      [1, 2, 3],
      [1, 2, 4],
      [1, 3, 4],
      [2, 3, 4],
    ]);
  });

  it("k=0の場合は空の組み合わせを返す", () => {
    const result = combinations([1, 2, 3], 0);
    expect(result).toEqual([[]]);
  });

  it("k=1の場合は各要素を単独で返す", () => {
    const result = combinations([1, 2, 3], 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it("k が配列の長さと同じ場合は配列全体を返す", () => {
    const result = combinations([1, 2, 3], 3);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it("空配列からの組み合わせを処理できる", () => {
    const result = combinations([], 0);
    expect(result).toEqual([[]]);
  });
});

describe("normalizeEffect", () => {
  it("基礎グループで UP がない場合は UP を付加する", () => {
    expect(normalizeEffect("基礎", "敏捷", DROP_EFFECTS)).toBe("敏捷UP");
    expect(normalizeEffect("基礎", "筋力", DROP_EFFECTS)).toBe("筋力UP");
  });

  it("基礎グループで既に UP がある場合はそのまま返す", () => {
    expect(normalizeEffect("基礎", "敏捷UP", DROP_EFFECTS)).toBe("敏捷UP");
  });

  it("付加グループで UP がない場合は UP を付加する", () => {
    expect(normalizeEffect("付加", "攻撃力", DROP_EFFECTS)).toBe("攻撃力UP");
  });

  it("付加グループで既に UP がある場合はそのまま返す", () => {
    expect(normalizeEffect("付加", "攻撃力UP", DROP_EFFECTS)).toBe("攻撃力UP");
  });

  it("付加グループで アップ がある場合はそのまま返す", () => {
    expect(normalizeEffect("付加", "HPアップ", DROP_EFFECTS)).toBe("HPアップ");
  });

  it("スキルグループはそのまま返す", () => {
    expect(normalizeEffect("スキル", "強攻", DROP_EFFECTS)).toBe("強攻");
    expect(normalizeEffect("スキル", "夜幕", DROP_EFFECTS)).toBe("夜幕");
  });

  it("完全一致が dropEffects にある場合は優先する", () => {
    // DROP_EFFECTS に存在する値はそのまま返される
    expect(normalizeEffect("基礎", "メイン能力UP", DROP_EFFECTS)).toBe(
      "メイン能力UP",
    );
  });

  it("前後の空白を除去する", () => {
    expect(normalizeEffect("基礎", "  敏捷  ", DROP_EFFECTS)).toBe("敏捷UP");
  });
});
