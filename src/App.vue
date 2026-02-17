<script setup lang="ts">
import { ref, computed } from 'vue';
import { run, DROP_EFFECTS } from './lib/kishitu-gensen';

// エリアごとの選択肢を取得
const allBaseEffects = Array.from(new Set(
  Object.values(DROP_EFFECTS).flatMap(area => area.base)
)).sort();
const allAdditionalEffects = Array.from(new Set(
  Object.values(DROP_EFFECTS).flatMap(area => area.additional)
)).sort();
const allSkillEffects = Array.from(new Set(
  Object.values(DROP_EFFECTS).flatMap(area => area.skill)
)).sort();

// 選択された値
const selectedBase = ref('知性UP');
const selectedAdditional = ref('攻撃力UP');
const selectedSkill = ref('夜幕');

// 結果
const result = ref<any>(null);
const error = ref<string>('');

// 計算実行
const calculate = () => {
  error.value = '';
  result.value = null;

  const input = [
    `基礎：${selectedBase.value}`,
    `付加：${selectedAdditional.value}`,
    `スキル：${selectedSkill.value}`
  ];

  try {
    const output = run(input);
    if (output.error) {
      error.value = output.error;
    } else {
      result.value = output;
    }
  } catch (e) {
    error.value = `エラーが発生しました: ${e}`;
  }
};

// 結果のフォーマット（エリアごと）
const formattedResults = computed(() => {
  if (!result.value?.results) return [];

  return result.value.results.map((area: any) => {
    return {
      areaName: area.areaName,
      groups: area.groups.map((g: any) => ({
        mode: g.mode,
        patternCount: g.patternCount,
        baseChoicesList: g.baseChoicesList,
        lockedAdditional: g.lockedAdditional,
        lockedSkill: g.lockedSkill,
        byRarity: g.byRarity,
        weapons: g.weapons
      }))
    };
  });
});
</script>

<template>
  <div class="container">
    <header>
      <h1>🎮 基質厳選ツール</h1>
      <p class="subtitle">アークナイツ：エンドフィールド - 基質（武器）厳選補助</p>
    </header>

    <div class="input-section">
      <h2>欲しいドロップを選択</h2>
      <div class="selectors">
        <div class="selector-group">
          <label for="base">基礎：</label>
          <select id="base" v-model="selectedBase">
            <option v-for="effect in allBaseEffects" :key="effect" :value="effect">
              {{ effect }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="additional">付加：</label>
          <select id="additional" v-model="selectedAdditional">
            <option v-for="effect in allAdditionalEffects" :key="effect" :value="effect">
              {{ effect }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="skill">スキル：</label>
          <select id="skill" v-model="selectedSkill">
            <option v-for="effect in allSkillEffects" :key="effect" :value="effect">
              {{ effect }}
            </option>
          </select>
        </div>
      </div>

      <button @click="calculate" class="calc-button">厳選パターンを計算</button>
    </div>

    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>

    <div v-if="result" class="results-section">
      <div class="selected-info">
        <h3>選択されたドロップ</h3>
        <ul>
          <li><strong>基礎：</strong>{{ result.wanted.base }}</li>
          <li><strong>付加：</strong>{{ result.wanted.additional }}</li>
          <li><strong>スキル：</strong>{{ result.wanted.skill }}</li>
        </ul>
      </div>

      <div v-for="area in formattedResults" :key="area.areaName" class="area-result">
        <h3 class="area-name">■ {{ area.areaName }}</h3>

        <div v-if="area.groups.length === 0" class="no-result">
          なし（このエリアでは目的の基質は入手できません）
        </div>

        <div v-for="(group, idx) in area.groups" :key="idx" class="pattern-group">
          <h4 class="mode-title">【{{ group.mode }}】（{{ group.patternCount }}パターン）</h4>

          <div class="pattern-details">
            <div class="base-choices">
              <strong>基礎（3種選択）候補:</strong>
              <ul>
                <li v-for="(choices, i) in group.baseChoicesList" :key="i">
                  {{ choices.join(', ') }}
                </li>
              </ul>
            </div>

            <div class="lock-info">
              <div v-if="group.mode === '付加固定'">
                <p><strong>付加（固定）:</strong> {{ group.lockedAdditional }}</p>
                <p><strong>スキル（ランダム）:</strong> エリアプールから（欲しい: {{ result.wanted.skill }}）</p>
              </div>
              <div v-else>
                <p><strong>スキル（固定）:</strong> {{ group.lockedSkill }}</p>
                <p><strong>付加（ランダム）:</strong> エリアプールから（欲しい: {{ result.wanted.additional }}）</p>
              </div>
            </div>

            <div class="weapons-list">
              <div v-if="group.byRarity[6]?.length" class="rarity-section rarity-6">
                <h5>⭐6</h5>
                <ul>
                  <li v-for="(weapon, i) in group.byRarity[6]" :key="i">{{ weapon }}</li>
                </ul>
              </div>

              <div v-if="group.byRarity[5]?.length" class="rarity-section rarity-5">
                <h5>⭐5</h5>
                <ul>
                  <li v-for="(weapon, i) in group.byRarity[5]" :key="i">{{ weapon }}</li>
                </ul>
              </div>

              <div v-if="group.byRarity[4]?.length" class="rarity-section rarity-4">
                <h5>⭐4</h5>
                <ul>
                  <li v-for="(weapon, i) in group.byRarity[4]" :key="i">{{ weapon }}</li>
                </ul>
              </div>

              <div v-if="group.byRarity.other?.length" class="rarity-section">
                <h5>⭐?</h5>
                <ul>
                  <li v-for="(weapon, i) in group.byRarity.other" :key="i">{{ weapon }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #646cff;
}

.subtitle {
  color: #888;
  margin-top: 0.5rem;
}

.input-section {
  background: rgba(100, 108, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.input-section h2 {
  margin-bottom: 1rem;
  font-size: 1.3em;
}

.selectors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selector-group label {
  font-weight: 600;
  min-width: 80px;
}

.selector-group select {
  flex: 1;
  max-width: 400px;
}

.calc-button {
  background-color: #646cff;
  color: white;
  padding: 0.75em 2em;
  font-size: 1.1em;
  border: none;
  width: 100%;
  max-width: 400px;
}

.calc-button:hover {
  background-color: #535bf2;
}

.error-message {
  background-color: #ff4444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.results-section {
  margin-top: 2rem;
}

.selected-info {
  background: rgba(100, 108, 255, 0.15);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.selected-info h3 {
  margin-bottom: 0.5rem;
}

.selected-info ul {
  list-style: none;
  padding-left: 1rem;
}

.selected-info li {
  margin: 0.3rem 0;
}

.area-result {
  margin-bottom: 2.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.area-name {
  color: #646cff;
  margin-bottom: 1rem;
  font-size: 1.5em;
}

.no-result {
  color: #888;
  font-style: italic;
  padding: 1rem;
}

.pattern-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 4px solid #646cff;
}

.mode-title {
  color: #ffd700;
  margin-bottom: 1rem;
}

.pattern-details {
  padding-left: 1rem;
}

.base-choices, .lock-info {
  margin-bottom: 1rem;
}

.base-choices ul, .lock-info ul {
  list-style: none;
  padding-left: 1rem;
}

.base-choices li {
  margin: 0.3rem 0;
}

.lock-info p {
  margin: 0.3rem 0;
}

.weapons-list {
  margin-top: 1rem;
}

.rarity-section {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.rarity-6 {
  background: rgba(255, 215, 0, 0.1);
}

.rarity-6 h5 {
  color: #ffd700;
}

.rarity-5 {
  background: rgba(192, 192, 192, 0.1);
}

.rarity-5 h5 {
  color: #c0c0c0;
}

.rarity-4 {
  background: rgba(205, 127, 50, 0.1);
}

.rarity-4 h5 {
  color: #cd7f32;
}

.rarity-section h5 {
  margin-bottom: 0.5rem;
  font-size: 1em;
}

.rarity-section ul {
  list-style: none;
  padding-left: 1rem;
}

.rarity-section li {
  margin: 0.3rem 0;
  font-size: 0.95em;
}

@media (max-width: 768px) {
  .selector-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .selector-group select {
    width: 100%;
    max-width: 100%;
  }

  .calc-button {
    max-width: 100%;
  }
}
</style>
