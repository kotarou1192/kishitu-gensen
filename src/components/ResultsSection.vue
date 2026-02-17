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
        <li><strong>基礎効果：</strong>{{ result.wanted.base }}</li>
        <li><strong>付加効果：</strong>{{ result.wanted.additional }}</li>
        <li><strong>スキル効果：</strong>{{ result.wanted.skill }}</li>
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
</style>
