<script setup lang="ts">
import RaritySection from './RaritySection.vue';
import type { PatternGroup } from '../types';

interface Props {
  group: PatternGroup;
  wantedAdditional: string;
  wantedSkill: string;
}

defineProps<Props>();
</script>

<template>
  <div class="pattern-group">
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
          <p><strong>スキル（ランダム）:</strong> エリアプールから（欲しい: {{ wantedSkill }}）</p>
        </div>
        <div v-else>
          <p><strong>スキル（固定）:</strong> {{ group.lockedSkill }}</p>
          <p><strong>付加（ランダム）:</strong> エリアプールから（欲しい: {{ wantedAdditional }}）</p>
        </div>
      </div>

      <div class="weapons-list">
        <RaritySection :rarity="6" :weapons="group.byRarity[6] || []" />
        <RaritySection :rarity="5" :weapons="group.byRarity[5] || []" />
        <RaritySection :rarity="4" :weapons="group.byRarity[4] || []" />
        <RaritySection :rarity="'other'" :weapons="group.byRarity.other || []" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
