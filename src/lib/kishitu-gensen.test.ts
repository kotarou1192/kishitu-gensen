import { describe, it, expect } from "vitest";
import { run, DROP_EFFECTS, WEAPONS } from "./kishitu-gensen";

describe("kishitu-gensen - run 関数", () => {
  it("正常な入力で結果を返す", () => {
    const input = ["基礎：知性", "付加：攻撃力", "スキル：夜幕"];
    const result = run(input);

    expect(result.error).toBeUndefined();
    expect(result.wanted).toBeDefined();
    expect(result.wanted?.base).toBe("知性UP");
    expect(result.wanted?.additional).toBe("攻撃力UP");
    expect(result.wanted?.skill).toBe("夜幕");
    expect(result.text).toContain("欲しいドロップ（確定入力）");
    expect(result.results).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
  });

  it("入力が3つでない場合はエラーを返す", () => {
    const input = ["基礎：知性", "付加：攻撃力"];
    const result = run(input);

    expect(result.error).toBe(
      "入力が不正です（基礎/付加/スキルを各1つずつ、合計3つ入力してください）",
    );
  });

  it("基礎が2つある場合はエラーを返す", () => {
    const input = ["基礎：知性", "基礎：筋力", "スキル：夜幕"];
    const result = run(input);

    expect(result.error).toBe(
      "入力が不正です（基礎/付加/スキルが各1つずつ必要です）",
    );
  });

  it("付加が2つある場合はエラーを返す", () => {
    const input = ["基礎：知性", "付加：攻撃力", "付加：HP"];
    const result = run(input);

    expect(result.error).toBe(
      "入力が不正です（基礎/付加/スキルが各1つずつ必要です）",
    );
  });

  it("スキルが2つある場合はエラーを返す", () => {
    const input = ["基礎：知性", "スキル：夜幕", "スキル：強攻"];
    const result = run(input);

    expect(result.error).toBe(
      "入力が不正です（基礎/付加/スキルが各1つずつ必要です）",
    );
  });

  it("不正なグループ名の場合はエラーを返す", () => {
    const input = ["基礎：知性", "付加：攻撃力", "その他：夜幕"];
    const result = run(input);

    expect(result.error).toContain("入力が不正です");
  });

  it("形式が不正な入力の場合はエラーを返す", () => {
    const input = ["基礎：知性", "付加：攻撃力", "夜幕"];
    const result = run(input);

    expect(result.error).toContain("入力が不正です");
  });

  it("実際の武器データで正しく動作する - 遺忘", () => {
    // 遺忘: 知性UP, アーツダメージUP, 夜幕
    const input = ["基礎：知性", "付加：アーツダメージ", "スキル：夜幕"];
    const result = run(input);

    expect(result.error).toBeUndefined();
    expect(result.wanted?.base).toBe("知性UP");
    expect(result.wanted?.additional).toBe("アーツダメージUP");
    expect(result.wanted?.skill).toBe("夜幕");

    // 中枢エリアと武陵城で遺忘が出るはず
    expect(result.results).toBeDefined();

    // 中枢エリアを確認
    const chusuArea = result.results?.find((r) => r.areaName === "中枢エリア");
    expect(chusuArea).toBeDefined();

    // 武陵城を確認
    const wuryoArea = result.results?.find((r) => r.areaName === "武陵城");
    expect(wuryoArea).toBeDefined();
  });

  it("結果の各エリアにはareaNameとgroupsが含まれる", () => {
    const input = ["基礎：知性", "付加：攻撃力", "スキル：効率"];
    const result = run(input);

    expect(result.error).toBeUndefined();
    expect(result.results).toBeDefined();

    if (result.results) {
      for (const areaResult of result.results) {
        expect(areaResult).toHaveProperty("areaName");
        expect(areaResult).toHaveProperty("groups");
        expect(typeof areaResult.areaName).toBe("string");
        expect(Array.isArray(areaResult.groups)).toBe(true);
      }
    }
  });

  it("全エリアが結果に含まれる", () => {
    const input = ["基礎：知性", "付加：攻撃力", "スキル：効率"];
    const result = run(input);

    expect(result.error).toBeUndefined();
    expect(result.results).toBeDefined();

    const areaNames = result.results?.map((r) => r.areaName) || [];
    const expectedAreas = Object.values(DROP_EFFECTS).map(
      (area) => area.area.ja,
    );

    expect(areaNames.sort()).toEqual(expectedAreas.sort());
  });

  it("出力テキストに全エリアが含まれる", () => {
    const input = ["基礎：知性", "付加：攻撃力", "スキル：効率"];
    const result = run(input);

    expect(result.error).toBeUndefined();
    expect(result.text).toBeDefined();

    for (const areaName of Object.values(DROP_EFFECTS).map(
      (area) => area.area.ja,
    )) {
      expect(result.text).toContain(areaName);
    }
  });
});

describe("DROP_EFFECTS", () => {
  it("全エリアが定義されている", () => {
    expect(DROP_EFFECTS).toHaveProperty("central_area");
    expect(DROP_EFFECTS).toHaveProperty("originium_park");
    expect(DROP_EFFECTS).toHaveProperty("mine_area");
    expect(DROP_EFFECTS).toHaveProperty("energy_highland");
    expect(DROP_EFFECTS).toHaveProperty("wuling_city");
    expect(DROP_EFFECTS).toHaveProperty("qingbo_fort");
  });

  it("各エリアにarea/effectsとbase, additional, skillプロパティがある", () => {
    for (const area of Object.values(DROP_EFFECTS)) {
      expect(area).toHaveProperty("area");
      expect(area).toHaveProperty("effects");
      expect(area.effects).toHaveProperty("base");
      expect(area.effects).toHaveProperty("additional");
      expect(area.effects).toHaveProperty("skill");
      expect(Array.isArray(area.effects.base)).toBe(true);
      expect(Array.isArray(area.effects.additional)).toBe(true);
      expect(Array.isArray(area.effects.skill)).toBe(true);
    }
  });

  it("全エリアにメイン能力UPが含まれる", () => {
    for (const area of Object.values(DROP_EFFECTS)) {
      expect(
        area.effects.base.some((effect) => effect.ja === "メイン能力UP"),
      ).toBe(true);
    }
  });

  it("全エリアに基本4能力UPが含まれる", () => {
    const basicStats = ["敏捷UP", "筋力UP", "意志UP", "知性UP"];
    for (const area of Object.values(DROP_EFFECTS)) {
      for (const stat of basicStats) {
        expect(area.effects.base.some((effect) => effect.ja === stat)).toBe(
          true,
        );
      }
    }
  });
});

describe("WEAPONS", () => {
  it("武器データが配列である", () => {
    expect(Array.isArray(WEAPONS)).toBe(true);
    expect(WEAPONS.length).toBeGreaterThan(0);
  });

  it("各武器に必要なプロパティがある", () => {
    for (const weapon of WEAPONS) {
      expect(weapon).toHaveProperty("name");
      expect(weapon).toHaveProperty("rarity");
      expect(weapon).toHaveProperty("category");
      expect(weapon).toHaveProperty("base");
      expect(weapon).toHaveProperty("additional");
      expect(weapon).toHaveProperty("skill");
    }
  });

  it("遺忘が正しいデータを持っている", () => {
    const ibou = WEAPONS.find((w) => w.name === "遺忘");
    expect(ibou).toBeDefined();
    expect(ibou?.rarity).toBe(6);
    expect(ibou?.base).toBe("知性UP");
    expect(ibou?.additional).toBe("アーツダメージUP");
    expect(ibou?.skill).toBe("夜幕");
  });
});
