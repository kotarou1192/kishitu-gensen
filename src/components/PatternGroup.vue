<script setup lang="ts">
import RaritySection from './RaritySection.vue';
import type { PatternGroup } from '../types';
import { computed } from 'vue';

interface Props {
  group: PatternGroup;
  wantedAdditional: string;
  wantedSkill: string;
}

const props = defineProps<Props>();

const weaponCountText = computed(() => {
  const counts: string[] = [];
  if (props.group.byRarity[6]?.length) counts.push(`☆6: ${props.group.byRarity[6].length}個`);
  if (props.group.byRarity[5]?.length) counts.push(`☆5: ${props.group.byRarity[5].length}個`);
  if (props.group.byRarity[4]?.length) counts.push(`☆4: ${props.group.byRarity[4].length}個`);
  if (props.group.byRarity.other?.length) counts.push(`☆?: ${props.group.byRarity.other.length}個`);
  return counts.length > 0 ? counts.join('、') : '武器なし';
});
</script>

<template>
  <div class="pattern-group">
    <h4 class="mode-title">【{{ group.mode }}】（{{ weaponCountText }}）</h4>

    <div class="pattern-details">
      <div class="base-choices">
        <div v-if="group.requiredBaseChoices.length > 0" class="required-choices">
          <strong>基礎（必須選択）:</strong>
          <p class="required-list">{{ group.requiredBaseChoices.join(', ') }}</p>
        </div>
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

.required-choices {
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-left: 3px solid #ffd700;
  border-radius: 4px;
}

.required-list {
  margin: 0.3rem 0 0 1rem;
  color: #ffd700;
  font-weight: 500;
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
