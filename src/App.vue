<script setup lang="ts">
import InputSection from './components/InputSection.vue';
import ResultsSection from './components/ResultsSection.vue';
import DescriptionBox from './components/DescriptionBox.vue';
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

    <DescriptionBox />

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

    <footer class="footer">
      <p>使いやすかったらシェアしてくださると励みになります 😊</p>
      <p class="repo-link">
        <a href="https://github.com/kotarou1192/kishitu-gensen" target="_blank" rel="noopener noreferrer">
          GitHub リポジトリ
        </a>
      </p>
    </footer>
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

.footer {
  text-align: center;
  margin-top: 3rem;
  padding: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #e0e0e0;
}

.footer p {
  margin: 0;
  margin-bottom: 0.5rem;
}

.footer p:last-child {
  margin-bottom: 0;
}

.repo-link a {
  color: #646cff;
  text-decoration: none;
  font-weight: 500;
}

.repo-link a:hover {
  text-decoration: underline;
}
</style>
