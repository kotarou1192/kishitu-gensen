<script setup lang="ts">
import AreaResult from "./AreaResult.vue";
import type { CalculationResult } from "../types";
import { localizeEffectName } from "../lib/i18n";
import { useI18n } from "../composables/useI18n";

interface Props {
  result: CalculationResult;
}

defineProps<Props>();
const { locale, t } = useI18n();
</script>

<template>
  <div class="results-section">
    <div class="selected-info">
      <h3>{{ t("resultsSelectedTitle") }}</h3>
      <ul>
        <li>
          <strong class="label-base">{{ t("resultsBaseLabel") }}</strong
          ><span class="effect-base">{{
            localizeEffectName(result.wanted.base, locale)
          }}</span>
        </li>
        <li>
          <strong class="label-additional">{{
            t("resultsAdditionalLabel")
          }}</strong
          ><span class="effect-additional">{{
            localizeEffectName(result.wanted.additional, locale)
          }}</span>
        </li>
        <li>
          <strong class="label-skill">{{ t("resultsSkillLabel") }}</strong
          ><span class="effect-skill">{{
            localizeEffectName(result.wanted.skill, locale)
          }}</span>
        </li>
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
