<template>
  <section class="history-section">
    <div class="history-header">
      <h2>計算履歴</h2>
      <div class="header-buttons">
        <button 
          v-if="history.length > 0"
          @click="showFavoritesOnly = !showFavoritesOnly" 
          class="filter-button"
          :class="{ active: showFavoritesOnly }"
        >
          ☆ {{ showFavoritesOnly ? 'すべて表示' : 'お気に入りのみ' }}
        </button>
        <button v-if="history.length > 0" @click="clearHistory" class="clear-button">
          すべて削除
        </button>
      </div>
    </div>
    <div v-if="history.length === 0" class="empty-message">
      計算履歴はまだありません
    </div>
    <div v-else-if="filteredHistory.length === 0" class="empty-message">
      お気に入りの履歴はまだありません
    </div>
    <div v-else class="history-list">
      <div
        v-for="(item, index) in filteredHistory"
        :key="index"
        class="history-item"
      >
        <button
          @click.stop="toggleFavorite(history.indexOf(item))"
          class="favorite-button"
          :class="{ active: item.isFavorite }"
          title="お気に入り"
        >
          ☆
        </button>
        <div class="history-content" @click="$emit('selectHistory', item)">
          <div class="history-effects">
            <span class="effect-badge effect-base">{{ item.base }}</span>
            <span class="effect-badge effect-additional">{{ item.additional }}</span>
            <span class="effect-badge effect-skill">{{ item.skill }}</span>
          </div>
          <div class="history-time">{{ formatTime(item.timestamp) }}</div>
        </div>
        <button
          @click.stop="removeFromHistory(history.indexOf(item))"
          class="delete-button"
          title="削除"
        >
          ×
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCalculationHistory, type HistoryItem } from "../composables/useCalculationHistory";

defineEmits<{
  selectHistory: [item: HistoryItem];
}>();

const { history, removeFromHistory, clearHistory, toggleFavorite } = useCalculationHistory();

// お気に入りのみ表示するフィルター
const showFavoritesOnly = ref(false);

// フィルタリングされた履歴
const filteredHistory = computed(() => {
  if (showFavoritesOnly.value) {
    return history.value.filter(item => item.isFavorite);
  }
  return history.value;
});

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 1時間以内
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return minutes === 0 ? "たった今" : `${minutes}分前`;
  }

  // 24時間以内
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}時間前`;
  }

  // それ以降は日付表示
  return date.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.history-section {
  margin: 2rem 0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 215, 0, 0.1);
  color: #999;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.filter-button:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  color: #ffd700;
}

.filter-button.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
  color: #ffd700;
  font-weight: 600;
}

.clear-button {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 87, 87, 0.1);
  color: #ff5757;
  border: 1px solid rgba(255, 87, 87, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.clear-button:hover {
  background: rgba(255, 87, 87, 0.2);
  border-color: #ff5757;
}

.empty-message {
  padding: 2rem;
  text-align: center;
  color: #666;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.2s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.favorite-button {
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  transition: all 0.2s;
  color: #666;
  flex-shrink: 0;
}

.favorite-button:hover {
  color: #ffd700;
  transform: scale(1.2);
}

.favorite-button.active {
  color: #ffd700;
}

.history-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
}

.history-content:hover {
  transform: translateX(4px);
}

.history-effects {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.effect-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.effect-base {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.4);
}

.effect-additional {
  background: rgba(100, 181, 246, 0.2);
  color: #64b5f6;
  border: 1px solid rgba(100, 181, 246, 0.4);
}

.effect-skill {
  background: rgba(102, 187, 106, 0.2);
  color: #66bb6a;
  border: 1px solid rgba(102, 187, 106, 0.4);
}

.history-time {
  font-size: 0.65rem;
  color: #999;
}

.delete-button {
  padding: 0.15rem 0.35rem;
  background: rgba(255, 87, 87, 0.1);
  color: #ff5757;
  border: 1px solid rgba(255, 87, 87, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: all 0.2s;
  min-width: 1.5rem;
  flex-shrink: 0;
}

.delete-button:hover {
  background: rgba(255, 87, 87, 0.2);
  border-color: #ff5757;
  transform: scale(1.1);
}
</style>
