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

// 武器名をパースして名前と効果に分ける
const parseWeaponName = (weaponText: string) => {
  // 形式: 武器名（基礎効果, 付加効果, スキル効果）
  const match = weaponText.match(/^(.+?)（(.+?), (.+?), (.+?)）$/);
  if (match) {
    return {
      name: match[1],
      base: match[2],
      additional: match[3],
      skill: match[4],
    };
  }
  // パースできない場合は元のテキストをそのまま返す
  return { name: weaponText, base: null, additional: null, skill: null };
};
</script>

<template>
  <div v-if="weapons.length" class="rarity-section" :class="rarityClass(rarity)">
    <h5>{{ rarityLabel(rarity) }}</h5>
    <ul>
      <li v-for="(weapon, i) in weapons" :key="i">
        <template v-if="parseWeaponName(weapon).base !== null">
          {{ parseWeaponName(weapon).name }}（<span class="effect-base">{{ parseWeaponName(weapon).base }}</span>, <span class="effect-additional">{{ parseWeaponName(weapon).additional }}</span>, <span class="effect-skill">{{ parseWeaponName(weapon).skill }}</span>）
        </template>
        <template v-else>
          {{ weapon }}
        </template>
      </li>
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
