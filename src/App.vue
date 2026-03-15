<script setup lang="ts">
import { ref } from "vue";
import InputSection from "./components/InputSection.vue";
import ResultsSection from "./components/ResultsSection.vue";
import DescriptionBox from "./components/DescriptionBox.vue";
import ChangelogSection from "./components/ChangelogSection.vue";
import HistorySection from "./components/HistorySection.vue";
import { useKishitsuCalculation } from "./composables/useKishitsuCalculation";
import type { HistoryItem } from "./composables/useCalculationHistory";
import { useI18n } from "./composables/useI18n";
import type { Locale } from "./lib/i18n";
import type { AdditionalEffect, BaseEffect, SkillEffect } from "./lib/constants/dropEffects";

const {
  allBaseEffects,
  allAdditionalEffects,
  allSkillEffects,
  selectedBase,
  selectedAdditional,
  selectedSkill,
  result,
  error,
  calculate,
} = useKishitsuCalculation();
const { locale, setLocale, t } = useI18n();

const copySuccess = ref(false);

// 履歴から選択された項目で計算
const handleSelectHistory = (item: HistoryItem) => {
  selectedBase.value = item.base;
  selectedAdditional.value = item.additional;
  selectedSkill.value = item.skill;
  calculate();
  // 計算結果セクションにスムーズスクロール
  setTimeout(() => {
    const resultsElement = document.querySelector(".results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

const shareToX = () => {
  const text = t("appTitle");
  const url = window.location.href;
  const hashtags = t("appShareHashtag");
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`,
    "_blank",
  );
};

const shareToBluesky = () => {
  const hashTag = `#${t("appShareHashtag")}`;
  const text = `${t("appTitle")}\n${window.location.href}\n\n${hashTag}`;
  window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`, "_blank");
};

const handleLocaleChange = (next: Locale) => {
  setLocale(next);
};

const handleSelectedBaseUpdate = (value: BaseEffect) => {
  selectedBase.value = value;
};

const handleSelectedAdditionalUpdate = (value: AdditionalEffect) => {
  selectedAdditional.value = value;
};

const handleSelectedSkillUpdate = (value: SkillEffect) => {
  selectedSkill.value = value;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("コピーに失敗しました:", err);
  }
};
</script>

<template>
  <div class="container">
    <header>
      <h1>{{ t("appTitle") }}</h1>
      <p class="subtitle">{{ t("appSubtitle") }}</p>
      <div class="language-switcher">
        <span class="language-label">{{ t("appLanguage") }}:</span>
        <button
          class="lang-button"
          :class="{ active: locale === 'ja' }"
          @click="handleLocaleChange('ja')"
        >
          {{ t("appLanguageJa") }}
        </button>
        <button
          class="lang-button"
          :class="{ active: locale === 'en' }"
          @click="handleLocaleChange('en')"
        >
          {{ t("appLanguageEn") }}
        </button>
      </div>
    </header>

    <DescriptionBox />

    <InputSection
      :all-base-effects="allBaseEffects"
      :all-additional-effects="allAdditionalEffects"
      :all-skill-effects="allSkillEffects"
      :selected-base="selectedBase"
      :selected-additional="selectedAdditional"
      :selected-skill="selectedSkill"
      @update:selected-base="handleSelectedBaseUpdate"
      @update:selected-additional="handleSelectedAdditionalUpdate"
      @update:selected-skill="handleSelectedSkillUpdate"
      @calculate="calculate"
    />

    <HistorySection @select-history="handleSelectHistory" />

    <div v-if="error" class="error-message">⚠️ {{ error }}</div>

    <ResultsSection v-if="result" :result="result" />

    <ChangelogSection />

    <footer class="footer">
      <p>{{ t("appSharePrompt") }}</p>

      <div class="share-buttons">
        <button @click="shareToX" class="share-button x-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
          {{ t("appShareX") }}
        </button>

        <button @click="shareToBluesky" class="share-button bluesky-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
            />
          </svg>
          {{ t("appShareBluesky") }}
        </button>

        <button @click="copyLink" class="share-button copy-button" :class="{ copied: copySuccess }">
          <svg
            v-if="!copySuccess"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {{ copySuccess ? t("appCopyDone") : t("appCopyLink") }}
        </button>
      </div>

      <p class="repo-link">
        <a
          href="https://github.com/kotarou1192/kishitu-gensen"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t("appGithubRepo") }}
        </a>
      </p>

      <p class="bug-report">
        {{ t("appBugReport") }}
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

.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.language-label {
  font-size: 0.9rem;
  color: #888;
}

.lang-button {
  border: 1px solid rgba(100, 108, 255, 0.35);
  background: transparent;
  color: #888;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-button:hover {
  border-color: #646cff;
  color: #646cff;
}

.lang-button.active {
  color: #fff;
  background: #646cff;
  border-color: #646cff;
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

.bug-report {
  color: #888;
  font-size: 0.85rem;
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.share-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.share-button svg {
  flex-shrink: 0;
}

.x-button {
  background-color: #000000;
}

.x-button:hover {
  background-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.bluesky-button {
  background-color: #1185fe;
}

.bluesky-button:hover {
  background-color: #0d6ecd;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(17, 133, 254, 0.3);
}

.copy-button {
  background-color: #646cff;
}

.copy-button:hover {
  background-color: #535bf2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(100, 108, 255, 0.3);
}

.copy-button.copied {
  background-color: #10b981;
}

.copy-button.copied:hover {
  background-color: #059669;
}
</style>
