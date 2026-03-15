<script setup lang="ts">
import PatternGroup from "./PatternGroup.vue";
import type { AreaResult } from "../types";
import { localizeAreaName } from "../lib/i18n";
import { useI18n } from "../composables/useI18n";

interface Props {
  area: AreaResult;
  wantedAdditional: string;
  wantedSkill: string;
}

defineProps<Props>();
const { locale, t } = useI18n();
</script>

<template>
  <div class="area-result">
    <h3 class="area-name">■ {{ localizeAreaName(area.areaName, locale) }}</h3>

    <div v-if="area.groups.length === 0" class="no-result">
      {{ t("areaNoResult") }}
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
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(10px);
  color: #646cff;
  margin: -1rem -1rem 1rem -1rem;
  padding: 1rem;
  font-size: 1.5em;
  border-radius: 8px 8px 0 0;
  border-bottom: 2px solid rgba(100, 108, 255, 0.3);
}

.no-result {
  color: #888;
  font-style: italic;
  padding: 1rem;
}
</style>
