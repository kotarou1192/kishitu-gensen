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
          <strong class="label-base">基礎効果（必須選択）:</strong>
          <p class="required-list"><span class="effect-base">{{ group.requiredBaseChoices.join(', ') }}</span></p>
        </div>
      </div>

      <div class="lock-info">
        <div v-if="group.mode === '付加固定'">
          <p><strong class="label-additional">付加効果（固定）:</strong> <span class="effect-additional">{{ group.lockedAdditional }}</span></p>
          <p><strong class="label-skill">スキル効果（ランダム）:</strong> 希望した効果: <span class="effect-skill">{{ wantedSkill }}</span></p>
        </div>
        <div v-else>
          <p><strong class="label-skill">スキル効果（固定）:</strong> <span class="effect-skill">{{ group.lockedSkill }}</span></p>
          <p><strong class="label-additional">付加効果（ランダム）:</strong> 希望した効果: <span class="effect-additional">{{ wantedAdditional }}</span></p>
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

.label-base {
  color: #ffd700;
}

.label-additional {
  color: #64b5f6;
}

.label-skill {
  color: #66bb6a;
}

.effect-base {
  color: #ffd700;
  font-weight: 600;
}

.effect-additional {
  color: #64b5f6;
  font-weight: 600;
}

.effect-skill {
  color: #66bb6a;
  font-weight: 600;
}
</style>
