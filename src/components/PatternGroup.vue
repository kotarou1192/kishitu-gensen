<script setup lang="ts">
import RaritySection from "./RaritySection.vue";
import type { PatternGroup } from "../types";
import { computed, ref } from "vue";
import { localizeEffectName } from "../lib/i18n";
import { useI18n } from "../composables/useI18n";

interface Props {
  group: PatternGroup;
  areaName: string;
  patternNumber: number;
  wantedAdditional: string;
  wantedSkill: string;
}

const props = defineProps<Props>();
const { locale, t } = useI18n();

const weaponCountText = computed(() => {
  const counts: string[] = [];
  if (props.group.byRarity[6]?.length)
    counts.push(
      t("patternCountFormat", {
        rarity: 6,
        count: props.group.byRarity[6].length,
      }),
    );
  if (props.group.byRarity[5]?.length)
    counts.push(
      t("patternCountFormat", {
        rarity: 5,
        count: props.group.byRarity[5].length,
      }),
    );
  if (props.group.byRarity[4]?.length)
    counts.push(
      t("patternCountFormat", {
        rarity: 4,
        count: props.group.byRarity[4].length,
      }),
    );
  if (props.group.byRarity.other?.length)
    counts.push(
      t("patternCountFormat", {
        rarity: "?",
        count: props.group.byRarity.other.length,
      }),
    );
  return counts.length > 0
    ? counts.join(locale.value === "ja" ? "、" : ", ")
    : t("patternWeaponsNone");
});

// エリア名とパターン番号からユニークIDを生成
const patternId = computed(() => {
  const areaId = props.areaName.replace(/\s+/g, "-").toLowerCase();
  return `${areaId}-pattern-${props.patternNumber}`;
});

const copySuccess = ref(false);

const copyPatternLink = async () => {
  const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${patternId.value}`;
  try {
    await navigator.clipboard.writeText(url);
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
  <div :id="patternId" class="pattern-group">
    <div class="pattern-header">
      <div class="header-left">
        <h4 class="pattern-title">
          {{ t("patternTitle", { number: patternNumber }) }}
        </h4>
        <span class="weapon-count">{{ weaponCountText }}</span>
      </div>
      <button
        @click="copyPatternLink"
        class="copy-link-button"
        :class="{ copied: copySuccess }"
        :title="t('patternCopyLinkTitle')"
      >
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
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
          ></path>
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          ></path>
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
      </button>
    </div>

    <div class="pattern-details">
      <div class="base-choices">
        <div
          v-if="group.requiredBaseChoices.length > 0"
          class="required-choices"
        >
          <strong class="label-base">{{ t("patternRequiredBase") }}</strong>
          <p class="required-list">
            <span class="effect-base">{{
              group.requiredBaseChoices
                .map((effect) => localizeEffectName(effect, locale))
                .join(", ")
            }}</span>
          </p>
        </div>
      </div>

      <div class="lock-info">
        <div v-if="group.mode === '付加固定'">
          <div class="required-choices required-additional">
            <strong class="label-additional">{{
              t("patternRequiredAdditional")
            }}</strong>
            <p class="required-list">
              <span class="effect-additional">{{
                localizeEffectName(group.lockedAdditional || "", locale)
              }}</span>
            </p>
          </div>
          <p class="random-note">
            <strong class="label-skill">{{ t("patternRandomSkill") }}</strong>
            {{ t("patternDesiredEffect") }}
            <span class="effect-skill">{{
              localizeEffectName(wantedSkill, locale)
            }}</span>
          </p>
        </div>
        <div v-else>
          <div class="required-choices required-skill">
            <strong class="label-skill">{{ t("patternRequiredSkill") }}</strong>
            <p class="required-list">
              <span class="effect-skill">{{
                localizeEffectName(group.lockedSkill || "", locale)
              }}</span>
            </p>
          </div>
          <p class="random-note">
            <strong class="label-additional">{{
              t("patternRandomAdditional")
            }}</strong>
            {{ t("patternDesiredEffect") }}
            <span class="effect-additional">{{
              localizeEffectName(wantedAdditional, locale)
            }}</span>
          </p>
        </div>
      </div>

      <div class="weapons-list">
        <RaritySection :rarity="6" :weapons="group.byRarity[6] || []" />
        <RaritySection :rarity="5" :weapons="group.byRarity[5] || []" />
        <RaritySection :rarity="4" :weapons="group.byRarity[4] || []" />
        <RaritySection
          :rarity="'other'"
          :weapons="group.byRarity.other || []"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pattern-group {
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.3);
  scroll-margin-top: 7rem;
}

.pattern-header {
  position: sticky;
  top: 3.8rem;
  z-index: 15;
  background: linear-gradient(
    135deg,
    rgba(100, 108, 255, 0.3) 0%,
    rgba(100, 108, 255, 0.15) 100%
  );
  backdrop-filter: blur(10px);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(100, 108, 255, 0.5);
  border-radius: 8px 8px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pattern-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 700;
  color: #646cff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.weapon-count {
  font-size: 0.9em;
  color: #aaa;
  font-weight: 500;
}

.copy-link-button {
  background: rgba(100, 108, 255, 0.2);
  border: 1px solid rgba(100, 108, 255, 0.4);
  color: #646cff;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-link-button:hover {
  background: rgba(100, 108, 255, 0.3);
  border-color: #646cff;
}

.copy-link-button.copied {
  background: rgba(102, 187, 106, 0.2);
  border-color: #66bb6a;
  color: #66bb6a;
}

.pattern-details {
  padding: 1rem;
}

.base-choices,
.lock-info {
  margin-bottom: 1rem;
}

.required-choices {
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-left: 3px solid #ffd700;
  border-radius: 4px;
}

.required-additional {
  background: rgba(100, 181, 246, 0.1);
  border-left: 3px solid #64b5f6;
}

.required-skill {
  background: rgba(102, 187, 106, 0.1);
  border-left: 3px solid #66bb6a;
}

.required-list {
  margin: 0.3rem 0 0 1rem;
  font-weight: 500;
}

.random-note {
  margin: 0.5rem 0;
  padding: 0.5rem;
  font-size: 0.95em;
  opacity: 0.85;
}

.base-choices ul,
.lock-info ul {
  list-style: none;
  padding-left: 1rem;
}

.base-choices li {
  margin: 0.3rem 0;
}

.weapons-list {
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .pattern-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .copy-link-button {
    align-self: flex-end;
  }
}
</style>
