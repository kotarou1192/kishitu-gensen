<script setup lang="ts">
interface Props {
  allBaseEffects: string[];
  allAdditionalEffects: string[];
  allSkillEffects: string[];
  selectedBase: string;
  selectedAdditional: string;
  selectedSkill: string;
}

interface Emits {
  (e: 'update:selectedBase', value: string): void;
  (e: 'update:selectedAdditional', value: string): void;
  (e: 'update:selectedSkill', value: string): void;
  (e: 'calculate'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="input-section">
    <h2>欲しいドロップを選択</h2>
    <div class="selectors">
      <div class="selector-group">
        <label for="base">基礎：</label>
        <select 
          id="base" 
          :value="selectedBase"
          @change="emit('update:selectedBase', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="effect in allBaseEffects" :key="effect" :value="effect">
            {{ effect }}
          </option>
        </select>
      </div>

      <div class="selector-group">
        <label for="additional">付加：</label>
        <select 
          id="additional" 
          :value="selectedAdditional"
          @change="emit('update:selectedAdditional', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="effect in allAdditionalEffects" :key="effect" :value="effect">
            {{ effect }}
          </option>
        </select>
      </div>

      <div class="selector-group">
        <label for="skill">スキル：</label>
        <select 
          id="skill" 
          :value="selectedSkill"
          @change="emit('update:selectedSkill', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="effect in allSkillEffects" :key="effect" :value="effect">
            {{ effect }}
          </option>
        </select>
      </div>
    </div>

    <button @click="emit('calculate')" class="calc-button">厳選パターンを計算</button>
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
  min-width: 80px;
}

.selector-group select {
  flex: 1;
  max-width: 400px;
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
