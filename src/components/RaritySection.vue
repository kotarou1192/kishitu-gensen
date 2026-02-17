<script setup lang="ts">
interface Props {
  rarity: number | 'other';
  weapons: string[];
}

defineProps<Props>();

const rarityLabel = (rarity: number | 'other') => {
  if (rarity === 'other') return '⭐?';
  return `⭐${rarity}`;
};

const rarityClass = (rarity: number | 'other') => {
  if (typeof rarity === 'number') {
    return `rarity-${rarity}`;
  }
  return '';
};
</script>

<template>
  <div v-if="weapons.length" class="rarity-section" :class="rarityClass(rarity)">
    <h5>{{ rarityLabel(rarity) }}</h5>
    <ul>
      <li v-for="(weapon, i) in weapons" :key="i">{{ weapon }}</li>
    </ul>
  </div>
</template>

<style scoped>
.rarity-section {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.rarity-6 {
  background: rgba(255, 215, 0, 0.1);
}

.rarity-6 h5 {
  color: #ffd700;
}

.rarity-5 {
  background: rgba(192, 192, 192, 0.1);
}

.rarity-5 h5 {
  color: #c0c0c0;
}

.rarity-4 {
  background: rgba(205, 127, 50, 0.1);
}

.rarity-4 h5 {
  color: #cd7f32;
}

.rarity-section h5 {
  margin-bottom: 0.5rem;
  font-size: 1em;
}

.rarity-section ul {
  list-style: none;
  padding-left: 1rem;
}

.rarity-section li {
  margin: 0.3rem 0;
  font-size: 0.95em;
}
</style>
