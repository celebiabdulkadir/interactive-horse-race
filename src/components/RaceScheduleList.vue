<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const races = computed(() => store.getters['races/allRaces'])
const currentRound = computed(() => store.getters['races/currentRound'])
</script>

<template>
  <div class="schedule-list">
    <div
      v-for="race in races"
      :key="race.id"
      class="schedule-item"
      :class="{
        current: race.round === currentRound,
        finished: race.status === 'finished',
        running: race.status === 'running',
      }"
    >
      <div class="item-main">
        <div class="round-info">
          <span class="round-number">R{{ race.round }}</span>
          <span class="distance">{{ race.distance }}m</span>
        </div>

        <div class="status-info">
          <span class="status-badge" :class="race.status">
            {{ race.status }}
          </span>
          <span v-if="race.results.length > 0" class="winner">
            🏁 {{ race.results[0]?.horse.name }}
          </span>
        </div>
      </div>

      <div class="horses-list">
        <div class="horses-header">
          <span class="horses-title">Horses:</span>
          <span class="horses-count">{{ race.horses.length }} total</span>
        </div>
        <div class="horses-grid">
          <div
            v-for="horse in race.horses"
            :key="horse.id"
            class="horse-item"
            :style="{ borderColor: horse.color }"
          >
            <span class="horse-color" :style="{ backgroundColor: horse.color }"></span>
            <span class="horse-name">{{ horse.name }}</span>
            <span class="horse-condition">{{ horse.condition }}</span>
          </div>
        </div>
      </div>

      <div class="item-details">
        <div v-if="race.results.length > 0" class="race-time">
          <span class="time-label">Winner Time:</span>
          <span class="time">{{ race.results[0]?.time.toFixed(2) }}s</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.round-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.round-number {
  font-size: 14px;
  font-weight: 600;
  color: #3498db;
}
.schedule-item:hover {
  border-color: #bdc3c7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.schedule-item.current {
  border-color: #3498db;
  background: #ebf3fd;
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.15);
}

.schedule-item.running {
  border-color: #f39c12;
  background: #fef9e7;
  animation: pulse 2s infinite;
}

.schedule-item.finished {
  border-color: #27ae60;
  background: #eafaf1;
}
.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.round-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.round-number {
  background: #34495e;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.distance {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}

.status-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #ecf0f1;
  color: #7f8c8d;
}

.status-badge.running {
  background: #f39c12;
  color: white;
}

.status-badge.finished {
  background: #27ae60;
  color: white;
}

.winner {
  font-size: 10px;
  color: #27ae60;
  font-weight: 600;
}

.item-details {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #ecf0f1;
}

.horses-count {
  color: #7f8c8d;
}

.horse-colors {
  display: flex;
  align-items: center;
  gap: 2px;
}

.horses-list {
  margin: 8px 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.horses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 10px;
}

.horses-title {
  font-weight: 600;
  color: #2c3e50;
}

.horses-count {
  color: #7f8c8d;
  font-size: 9px;
}

.horses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 4px;
  max-height: 120px;
  overflow-y: auto;
}

.horse-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 3px;
  font-size: 9px;
  transition: all 0.2s;
}

.horse-item:hover {
  border-color: #bdc3c7;
  background: #f8f9fa;
}

.horse-color {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.horse-name {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.horse-condition {
  background: #ecf0f1;
  color: #7f8c8d;
  padding: 1px 3px;
  border-radius: 2px;
  font-size: 8px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

@media (max-width: 1400px) {
  .horses-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .horse-name {
    font-size: 8px;
  }
}

.horses-grid::-webkit-scrollbar {
  width: 4px;
}

.horses-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.horses-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.horses-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
