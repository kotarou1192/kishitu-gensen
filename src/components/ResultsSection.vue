<script setup lang="ts">
import AreaResult from './AreaResult.vue';
import type { CalculationResult } from '../types';

interface Props {
  result: CalculationResult;
}

defineProps<Props>();
</script>

<template>
  <div class="results-section">
    <div class="selected-info">
      <h3>選択された基質効果</h3>
      <ul>
        <li><strong class="label-base">基礎効果：</strong><span class="effect-base">{{ result.wanted.base }}</span></li>
        <li><strong class="label-additional">付加効果：</strong><span class="effect-additional">{{ result.wanted.additional }}</span></li>
        <li><strong class="label-skill">スキル効果：</strong><span class="effect-skill">{{ result.wanted.skill }}</span></li>
      </ul>
    </div>

    <AreaResult
      v-for="area in result.results"
      :key="area.areaName"
      :area="area"
      :wanted-additional="result.wanted.additional"
      :wanted-skill="result.wanted.skill"
    />
  </div>
</template>

<style scoped>
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
