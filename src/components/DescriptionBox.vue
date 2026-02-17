<template>
  <div class="description-box">
    <p class="description-text">
      このツールは、欲しい基質を選択すると、一緒に狙える基質を超域活性点ごとに全パターン表示します。
    </p>
    
    <p class="description-text">
      武器及び超域活性点は2026/02/17時点のデータです。
    </p>
  </div>
</template>

<style scoped>
.description-box {
  background-color: #f5f5f5;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem auto;
  max-width: 800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.description-text {
  margin: 0;
  padding: 0.5rem 0;
  color: #333;
  line-height: 1.6;
}

.description-text:first-child {
  padding-top: 0;
}

.description-text:last-child {
  padding-bottom: 0;
}
</style>
