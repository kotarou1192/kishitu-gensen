<script setup lang="ts">
import { localizeEffectName } from "../lib/i18n";
import { useI18n } from "../composables/useI18n";
import type {
  AdditionalEffect,
  BaseEffect,
  SkillEffect,
} from "../lib/constants/dropEffects";

interface Props {
  allBaseEffects: BaseEffect[];
  allAdditionalEffects: AdditionalEffect[];
  allSkillEffects: SkillEffect[];
  selectedBase: BaseEffect;
  selectedAdditional: AdditionalEffect;
  selectedSkill: SkillEffect;
}

interface Emits {
  (e: "update:selectedBase", value: BaseEffect): void;
  (e: "update:selectedAdditional", value: AdditionalEffect): void;
  (e: "update:selectedSkill", value: SkillEffect): void;
  (e: "calculate"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const { locale, t } = useI18n();
</script>

<template>
  <div class="input-section">
    <h2>{{ t("inputTitle") }}</h2>
    <div class="selectors">
      <div class="selector-group">
        <label for="base" class="label-base">{{ t("inputBaseLabel") }}</label>
        <select
          id="base"
          class="select-base"
          :value="selectedBase"
          @change="
            emit(
              'update:selectedBase',
              ($event.target as HTMLSelectElement).value as BaseEffect,
            )
          "
        >
          <option
            v-for="effect in allBaseEffects"
            :key="effect"
            :value="effect"
          >
            {{ localizeEffectName(effect, locale) }}
          </option>
        </select>
      </div>

      <div class="selector-group">
        <label for="additional" class="label-additional">{{
          t("inputAdditionalLabel")
        }}</label>
        <select
          id="additional"
          class="select-additional"
          :value="selectedAdditional"
          @change="
            emit(
              'update:selectedAdditional',
              ($event.target as HTMLSelectElement).value as AdditionalEffect,
            )
          "
        >
          <option
            v-for="effect in allAdditionalEffects"
            :key="effect"
            :value="effect"
          >
            {{ localizeEffectName(effect, locale) }}
          </option>
        </select>
      </div>

      <div class="selector-group">
        <label for="skill" class="label-skill">{{
          t("inputSkillLabel")
        }}</label>
        <select
          id="skill"
          class="select-skill"
          :value="selectedSkill"
          @change="
            emit(
              'update:selectedSkill',
              ($event.target as HTMLSelectElement).value as SkillEffect,
            )
          "
        >
          <option
            v-for="effect in allSkillEffects"
            :key="effect"
            :value="effect"
          >
            {{ localizeEffectName(effect, locale) }}
          </option>
        </select>
      </div>
    </div>

    <button @click="emit('calculate')" class="calc-button">
      {{ t("inputCalculate") }}
    </button>
  </div>
</template>

<style scoped>
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
  width: 100px;
  flex-shrink: 0;
}

.selector-group select {
  flex: 1;
  max-width: 400px;
  font-weight: 600;
}

.label-base {
  color: #ffd700;
}

.select-base {
  border: 2px solid #ffd700;
  color: #ffd700;
}

.label-additional {
  color: #64b5f6;
}

.select-additional {
  border: 2px solid #64b5f6;
  color: #64b5f6;
}

.label-skill {
  color: #66bb6a;
}

.select-skill {
  border: 2px solid #66bb6a;
  color: #66bb6a;
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
