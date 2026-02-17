<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Commit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  email: string;
  date: string;
  relativeDate: string;
  url: string;
}

interface Changelog {
  generated: string;
  commits: Commit[];
}

const changelog = ref<Changelog | null>(null);
const loading = ref(true);
const error = ref(false);
const isExpanded = ref(false);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(async () => {
  try {
    const response = await fetch('/kishitu-gensen/changelog.json');
    if (!response.ok) throw new Error('Failed to fetch changelog');
    changelog.value = await response.json();
  } catch (e) {
    console.error('Failed to load changelog:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="changelog-section">
    <div class="changelog-header" @click="toggleExpanded">
      <h3>📝 最近の更新</h3>
      <span class="toggle-icon" :class="{ expanded: isExpanded }">▼</span>
    </div>
    
    <div v-if="isExpanded" class="changelog-content">
      <div v-if="loading" class="loading">読み込み中...</div>
      
      <div v-else-if="error" class="error-message">
        更新履歴の読み込みに失敗しました
      </div>
      
      <div v-else-if="changelog && changelog.commits.length > 0" class="commits-list">
        <div v-for="commit in changelog.commits" :key="commit.hash" class="commit-item">
          <div class="commit-header">
            <a :href="commit.url" target="_blank" rel="noopener noreferrer" class="commit-hash">
              {{ commit.shortHash }}
            </a>
            <span class="commit-date">{{ commit.relativeDate }}</span>
          </div>
          <div class="commit-message">{{ commit.message }}</div>
        </div>
        
        <div class="view-all">
          <a 
            href="https://github.com/kotarou1192/kishitu-gensen/commits/main" 
            target="_blank" 
            rel="noopener noreferrer"
            class="view-all-link"
          >
            すべての更新履歴を見る →
          </a>
        </div>
      </div>
      
      <div v-else class="no-commits">
        更新履歴がありません
      </div>
    </div>
  </div>
</template>

<style scoped>
.changelog-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.changelog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.changelog-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.changelog-section h3 {
  margin: 0;
  color: #646cff;
  font-size: 1.2em;
}

.toggle-icon {
  color: #646cff;
  font-size: 0.8em;
  transition: transform 0.3s;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.changelog-content {
  padding: 0 1.5rem 1.5rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading, .error-message, .no-commits {
  color: #888;
  padding: 1rem;
  text-align: center;
  font-style: italic;
}

.error-message {
  color: #ff6b6b;
}

.commits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.commit-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #646cff;
  transition: all 0.2s;
}

.commit-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-left-color: #535bf2;
}

.commit-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.85em;
}

.commit-hash {
  font-family: monospace;
  color: #646cff;
  text-decoration: none;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 3px;
  transition: all 0.2s;
}

.commit-hash:hover {
  background: rgba(100, 108, 255, 0.2);
  text-decoration: none;
}

.commit-date {
  color: #888;
  font-size: 0.95em;
}

.commit-message {
  color: rgba(255, 255, 255, 0.87);
  line-height: 1.5;
}

.view-all {
  margin-top: 1rem;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(100, 108, 255, 0.2);
}

.view-all-link {
  color: #646cff;
  text-decoration: none;
  font-size: 0.9em;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #535bf2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .changelog-header {
    padding: 1rem;
  }
  
  .changelog-content {
    padding: 0 1rem 1rem;
  }
  
  .commit-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
}
</style>
