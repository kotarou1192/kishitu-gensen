<script setup lang="ts">
import RaritySection from './RaritySection.vue';
import type { PatternGroup } from '../types';
import { computed } from 'vue';

interface Props {
  group: PatternGroup;
  patternNumber: number;
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
    <div class="pattern-header">
      <h4 class="pattern-title">パターン {{ patternNumber }}</h4>
      <span class="weapon-count">{{ weaponCountText }}</span>
    </div>

    <div class="pattern-details">
      <div class="base-choices">
        <div v-if="group.requiredBaseChoices.length > 0" class="required-choices">
          <strong class="label-base">基礎効果（必須選択）:</strong>
          <p class="required-list"><span class="effect-base">{{ group.requiredBaseChoices.join(', ') }}</span></p>
        </div>
      </div>

      <div class="lock-info">
        <div v-if="group.mode === '付加固定'">
          <div class="required-choices required-additional">
            <strong class="label-additional">付加効果（必須選択）:</strong>
            <p class="required-list"><span class="effect-additional">{{ group.lockedAdditional }}</span></p>
          </div>
          <p class="random-note"><strong class="label-skill">スキル効果（ランダム）:</strong> 希望した効果: <span class="effect-skill">{{ wantedSkill }}</span></p>
        </div>
        <div v-else>
          <div class="required-choices required-skill">
            <strong class="label-skill">スキル効果（必須選択）:</strong>
            <p class="required-list"><span class="effect-skill">{{ group.lockedSkill }}</span></p>
          </div>
          <p class="random-note"><strong class="label-additional">付加効果（ランダム）:</strong> 希望した効果: <span class="effect-additional">{{ wantedAdditional }}</span></p>
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(100, 108, 255, 0.3);
}

.pattern-header {
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.3) 0%, rgba(100, 108, 255, 0.15) 100%);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(100, 108, 255, 0.5);
}

.pattern-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 700;
  color: #646cff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.weapon-count {
  font-size: 0.9em;
  color: #aaa;
  font-weight: 500;
}

.pattern-details {
  padding: 1rem;
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

.required-additional {
  background: rgba(100, 181, 246, 0.1);
  border-left: 3px solid #64b5f6;
}

.required-skill {
  background: rgba(102, 187, 106, 0.1);
  border-left: 3px solid #66bb6a;
}

.required-list {
  margin: 0.3rem 0 0 1rem;
  font-weight: 500;
}

.random-note {
  margin: 0.5rem 0;
  padding: 0.5rem;
  font-size: 0.95em;
  opacity: 0.85;
}

.base-choices ul, .lock-info ul {
  list-style: none;
  padding-left: 1rem;
}

.base-choices li {
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
