<script setup lang="ts">
import PatternGroup from './PatternGroup.vue';
import type { AreaResult } from '../types';

interface Props {
  area: AreaResult;
  wantedAdditional: string;
  wantedSkill: string;
}

defineProps<Props>();
</script>

<template>
  <div class="area-result">
    <h3 class="area-name">■ {{ area.areaName }}</h3>

    <div v-if="area.groups.length === 0" class="no-result">
      なし（このエリアでは目的の基質は入手できません）
    </div>

    <PatternGroup
      v-for="(group, idx) in area.groups"
      :key="idx"
      :group="group"
      :area-name="area.areaName"
      :pattern-number="idx + 1"
      :wanted-additional="wantedAdditional"
      :wanted-skill="wantedSkill"
    />
  </div>
</template>

<style scoped>
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
</style>
