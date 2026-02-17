<script setup lang="ts">
import InputSection from './components/InputSection.vue';
import ResultsSection from './components/ResultsSection.vue';
import { useKishitsuCalculation } from './composables/useKishitsuCalculation';

const {
  allBaseEffects,
  allAdditionalEffects,
  allSkillEffects,
  selectedBase,
  selectedAdditional,
  selectedSkill,
  result,
  error,
  calculate
} = useKishitsuCalculation();
</script>

<template>
  <div class="container">
    <header>
      <h1>🎮 基質厳選ツール</h1>
      <p class="subtitle">アークナイツ：エンドフィールド - 基質（武器）厳選補助</p>
    </header>

    <InputSection
      :all-base-effects="allBaseEffects"
      :all-additional-effects="allAdditionalEffects"
      :all-skill-effects="allSkillEffects"
      :selected-base="selectedBase"
      :selected-additional="selectedAdditional"
      :selected-skill="selectedSkill"
      @update:selected-base="selectedBase = $event"
      @update:selected-additional="selectedAdditional = $event"
      @update:selected-skill="selectedSkill = $event"
      @calculate="calculate"
    />

    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>

    <ResultsSection v-if="result" :result="result" />
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #646cff;
}

.subtitle {
  color: #888;
  margin-top: 0.5rem;
}

.error-message {
  background-color: #ff4444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
