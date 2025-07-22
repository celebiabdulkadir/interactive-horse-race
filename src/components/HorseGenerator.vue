<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
</script>
<template>
  <div class="horse-generator">
    <div class="header">
      <h3>🐎 Horses ({{ horses.length }}/20)</h3>
    </div>

    <div v-if="horses.length > 0" class="horses-list">
      <div v-for="horse in horses" :key="horse.id" class="horse-item">
        <div class="horse-info">
          <div class="horse-color" :style="{ backgroundColor: horse.color }"></div>
          <div class="horse-details">
            <div class="horse-name">{{ horse.name }}</div>
            <div class="horse-condition">
              <div class="condition-bar">
                <div
                  class="condition-fill"
                  :style="{
                    width: `${horse.condition}%`,
                    backgroundColor: horse.color,
                  }"
                ></div>
              </div>
              <span class="condition-text">{{ horse.condition }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-horses">
      <div class="empty-state">
        <div class="empty-icon">🐎</div>
        <p>No horses yet</p>
        <small>Generate horses to start</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horse-generator {
  padding: 20px;
  height: 100%;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e8ed;
}

.header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.horses-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.horse-item {
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.2s;
  background: #fafbfc;
}

.horse-item:hover {
  background: #f0f2f5;
  border-color: #d1d9e0;
  transform: translateX(2px);
}

.horse-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.horse-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.horse-details {
  flex: 1;
  min-width: 0;
}

.horse-name {
  font-weight: 600;
  font-size: 13px;
  color: #2c3e50;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.horse-condition {
  display: flex;
  align-items: center;
  gap: 8px;
}

.condition-bar {
  flex: 1;
  height: 4px;
  background-color: #e1e8ed;
  border-radius: 2px;
  overflow: hidden;
}

.condition-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 2px;
}

.condition-text {
  font-size: 11px;
  color: #7f8c8d;
  font-weight: 600;
  min-width: 20px;
  text-align: right;
}

.no-horses {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state {
  text-align: center;
  color: #95a5a6;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-state p {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.empty-state small {
  font-size: 12px;
  opacity: 0.7;
}

@media (max-width: 1400px) {
  .horses-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
